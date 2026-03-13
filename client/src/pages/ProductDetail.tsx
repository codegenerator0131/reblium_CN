import { useParams, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useState } from "react";
import ImageCarousel from "@/components/ImageCarousel";

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

export default function ProductDetail() {
  const { itemId } = useParams<{ itemId: string }>();
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const [selectedLicense, setSelectedLicense] = useState<"personal" | "commercial">("personal");

  const itemQuery = trpc.store.getItemById.useQuery({ itemId: parseInt(itemId || "0") });
  const addToCartMutation = trpc.cart.addItem.useMutation();

  if (itemQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">{t('common.loading')}</div>
        </div>
      </DashboardLayout>
    );
  }

  const item = itemQuery.data;

  if (!item) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">{t('product.notFound')}</h1>
            <Button onClick={() => setLocation("/store")}>{t('product.backToStore')}</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const textureTypes = item.textureTypes ? JSON.parse(item.textureTypes) : [];

  const handleAddToCart = () => {
    addToCartMutation.mutate(
      { storeItemId: item.id, licenseType: selectedLicense }
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/store")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('product.backToStore')}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Carousel */}
          <div className="flex items-center justify-center">
            <ImageCarousel
              images={[
                item.thumbnailUrl,
                item.image2Url,
                item.image3Url,
                item.image4Url,
              ]}
              alt={item.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <Badge className="mb-2 bg-cyan-500 text-black">
                {language === 'zh' ? (CATEGORY_LABELS_ZH[item.category] ?? item.category.toUpperCase()) : item.category.toUpperCase()}
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{language === 'zh' && item.nameCn ? item.nameCn : item.name}</h1>
              <p className="text-muted-foreground">{language === 'zh' && item.descriptionCn ? item.descriptionCn : item.description}</p>
            </div>

            {/* Pricing */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('store.personalLicense')}:</span>
                  <span className="text-lg font-bold text-cyan-400">
                    ${item.personalPriceUSD} / ¥{item.personalPriceCNY}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('store.commercialLicense')}:</span>
                  <span className="text-lg font-bold text-cyan-400">
                    ${item.commercialPriceUSD} / ¥{item.commercialPriceCNY}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t('product.techSpecs')}</h2>

              {/* Poly Count */}
              {item.polyCount && item.polyCount > 0 && (
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('product.polyCount')}:</span>
                    <span className="font-semibold">
                      {item.polyCount.toLocaleString()} {t('product.polygons')}
                    </span>
                  </div>
                </Card>
              )}

              {/* File Format */}
              <Card className="p-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('product.fileFormat')}:</span>
                  <Badge variant="outline">{item.fileFormat}</Badge>
                </div>
              </Card>

              {/* File Size */}
              {item.fileSize && item.fileSize > 0 && (
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('product.fileSize')}:</span>
                    <span className="font-semibold">{item.fileSize} MB</span>
                  </div>
                </Card>
              )}

              {/* Texture Types */}
              {textureTypes.length > 0 && (
                <Card className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">{t('product.textureMaps')}:</h3>
                    <div className="flex flex-wrap gap-2">
                      {textureTypes.map((texture: string) => (
                        <Badge key={texture} className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">
                          {texture.charAt(0).toUpperCase() + texture.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* License Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold">{t('product.chooseLicense')}:</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedLicense === "personal" ? "default" : "outline"}
                  onClick={() => setSelectedLicense("personal")}
                  className={selectedLicense === "personal" ? "bg-cyan-500 hover:bg-cyan-600 text-black" : ""}
                >
                  {t('store.personal')}
                </Button>
                <Button
                  variant={selectedLicense === "commercial" ? "default" : "outline"}
                  onClick={() => setSelectedLicense("commercial")}
                  className={selectedLicense === "commercial" ? "bg-cyan-500 hover:bg-cyan-600 text-black" : ""}
                >
                  {t('store.commercial')}
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {addToCartMutation.isPending ? t('product.adding') : t('product.addToCart')}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
