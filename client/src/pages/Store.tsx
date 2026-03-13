import DashboardLayout from "@/components/DashboardLayout";
import LicenseModal from "@/components/LicenseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Loader2, Search, ShoppingCart } from "lucide-react";
import { BecomeArtistModal } from "@/components/BecomeArtistModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

const CATEGORY_LABELS_EN: Record<string, string> = {
  clothing: "Clothing",
  hair: "Hair",
  face: "Face",
  accessories: "Accessories",
  animations: "Animations",
  packs: "Packs",
  fantasy: "Fantasy",
  "sci-fi": "Sci-Fi",
};

const CATEGORY_LABELS_ZH: Record<string, string> = {
  clothing: "服装",
  hair: "发型",
  face: "脸部",
  accessories: "配件",
  animations: "动画",
  packs: "包",
  fantasy: "奇幻",
  "sci-fi": "科幻",
};

export default function Store() {
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const CATEGORY_LABELS = language === 'zh' ? CATEGORY_LABELS_ZH : CATEGORY_LABELS_EN;
  const storeItemsQuery = trpc.store.listItems.useQuery({});
  const utils = trpc.useUtils();

  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [selectedItemForLicense, setSelectedItemForLicense] = useState<number | null>(null);
  const [becomeArtistOpen, setBecomeArtistOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const addToCartMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
      toast.success(t('store.addedToCart'));
      setLicenseModalOpen(false);
      setSelectedItemForLicense(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Flatten all items from all categories
  const allItems = useMemo(() => {
    if (!storeItemsQuery.data) return [];
    return storeItemsQuery.data.flatMap(cat => cat.items);
  }, [storeItemsQuery.data]);

  // Available categories derived from data
  const categories = useMemo(() => {
    if (!storeItemsQuery.data) return [];
    return storeItemsQuery.data.map(cat => cat.name.toLowerCase());
  }, [storeItemsQuery.data]);

  // Helper to get localised category label
  const getCategoryLabel = (cat: string) =>
    language === 'zh' ? (CATEGORY_LABELS_ZH[cat.toLowerCase()] ?? cat) : (CATEGORY_LABELS_EN[cat.toLowerCase()] ?? cat);

  // Filtered items based on search + category
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesCategory = !activeCategory || item.category?.toLowerCase() === activeCategory;
      const displayName = language === 'zh' && item.nameCn ? item.nameCn : item.name;
      const matchesSearch = !searchQuery.trim() ||
        displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allItems, activeCategory, searchQuery, language]);

  const getItemById = (id: number) => allItems.find(i => i.id === id) ?? null;

  const handleChooseLicense = (itemId: number) => {
    setSelectedItemForLicense(itemId);
    setLicenseModalOpen(true);
  };

  const handleSelectLicense = async (licenseType: "personal" | "commercial") => {
    if (!selectedItemForLicense) return;
    const item = getItemById(selectedItemForLicense);
    if (!item) return;
    await addToCartMutation.mutateAsync({
      storeItemId: selectedItemForLicense,
      licenseType,
      quantity: 1,
    });
  };

  if (storeItemsQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      </DashboardLayout>
    );
  }

  const selectedItem = selectedItemForLicense ? getItemById(selectedItemForLicense) : null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">{t("store.title")}</h1>
          <Button
            onClick={() => setBecomeArtistOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
          >
            {t("store.becomeResidentArtist")}
          </Button>
        </div>

        {/* Search + category filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t('store.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-border"
            />
          </div>

          {/* Category filter chips */}
          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={[
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                activeCategory === null
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground",
              ].join(" ")}
            >
              {t('store.all')}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={[
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  activeCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground",
                ].join(" ")}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredItems.length} {filteredItems.length === 1 ? t('store.asset') : t('store.assets')} {t('store.found')}
        </p>

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl cursor-pointer bg-muted aspect-[3/4]"
                onClick={() => setLocation(`/product/${item.id}`)}
              >
                {/* Image */}
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Category badge */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/50 text-white/90 backdrop-blur-sm">
                    {getCategoryLabel(item.category ?? "")}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">{language === 'zh' && item.nameCn ? item.nameCn : item.name}</p>
                  <p className="text-cyan-300 text-xs font-medium">${item.personalPriceUSD} / ¥{item.personalPriceCNY}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChooseLicense(item.id);
                    }}
                    disabled={addToCartMutation.isPending}
                    size="sm"
                    className="mt-2 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs py-1 h-7"
                  >
                    {addToCartMutation.isPending && selectedItemForLicense === item.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <><ShoppingCart className="w-3 h-3 mr-1" />{t('product.addToCart')}</>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <Search className="w-10 h-10 opacity-30" />
            <p className="text-lg font-medium">{t('store.noAssetsFound')}</p>
            <p className="text-sm">{t('store.adjustSearch')}</p>
          </div>
        )}
      </div>

      <BecomeArtistModal
        open={becomeArtistOpen}
        onOpenChange={setBecomeArtistOpen}
      />

      <LicenseModal
        isOpen={licenseModalOpen}
        itemName={selectedItem?.name ?? ""}
        personalPriceUSD={parseFloat(selectedItem?.personalPriceUSD?.toString() ?? "5")}
        personalPriceCNY={parseFloat(selectedItem?.personalPriceCNY?.toString() ?? "36")}
        commercialPriceUSD={parseFloat(selectedItem?.commercialPriceUSD?.toString() ?? "25")}
        commercialPriceCNY={parseFloat(selectedItem?.commercialPriceCNY?.toString() ?? "180")}
        onClose={() => {
          setLicenseModalOpen(false);
          setSelectedItemForLicense(null);
        }}
        onSelectLicense={handleSelectLicense}
        isLoading={addToCartMutation.isPending}
      />
    </DashboardLayout>
  );
}
