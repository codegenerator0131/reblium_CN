import DashboardLayout from "@/components/DashboardLayout";
import LicenseModal from "@/components/LicenseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ShoppingCart, X, Check } from "lucide-react";
import { BecomeArtistModal } from "@/components/BecomeArtistModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import tmoApi, { TMO_IMAGE_BASE_URL, TMO_MEDIA_URL, STORE_PAGE_SIZE, type LicenseType } from "@/lib/tmoApi";
import type { MappedProduct, TMOProduct, TMOCategory, TMOCartItemProductOption } from "@/types/tmo";

interface PurchasedProductInfo {
  licenseType: LicenseType;
  orderId: string;
  orderStatus: string;
}

export default function Store() {
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const { addToCart, loading: cartLoading, itemsCount, setIsCartOpen } = useCart();

  const [becomeArtistOpen, setBecomeArtistOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");

  // Data state
  const [products, setProducts] = useState<MappedProduct[]>([]);
  const [rawProducts, setRawProducts] = useState<TMOProduct[]>([]);
  const [categories, setCategories] = useState<TMOCategory[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // License modal
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MappedProduct | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Purchased products tracking
  const [purchasedProducts, setPurchasedProducts] = useState<Map<string, PurchasedProductInfo[]>>(new Map());

  // Fetch products with server-side filtering
  const fetchProducts = useCallback(
    async (categoryId?: string, search?: string, page: number = 1) => {
      setAssetsLoading(true);
      try {
        const filterGroups: { filters: { field: string; value: string; condition_type: string }[] }[] = [];

        // Category filter
        if (categoryId && categoryId !== "all") {
          filterGroups.push({
            filters: [{ field: "category_id", value: categoryId, condition_type: "eq" }],
          });
        }

        // Search filter
        if (search && search.trim()) {
          filterGroups.push({
            filters: [{ field: "name", value: `%${search.trim()}%`, condition_type: "like" }],
          });
        }

        const response = await tmoApi.getProducts({
          filter_groups: filterGroups,
          page_size: STORE_PAGE_SIZE,
          current_page: page,
          sort_orders: [{ field: "entity_id", direction: "DESC" }],
        });

        setRawProducts(response.items);
        const mapped = response.items.map((product) =>
          tmoApi.mapTMOProductToMapped(product, TMO_IMAGE_BASE_URL),
        );
        setProducts(mapped);
        setTotalCount(response.total_count);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(t("store.loadError") || "Failed to load products");
      } finally {
        setAssetsLoading(false);
      }
    },
    [t],
  );

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await tmoApi.getCategories();
      const flattenCategories = (cats: TMOCategory[]): TMOCategory[] => {
        return cats.reduce<TMOCategory[]>((acc, cat) => {
          acc.push(cat);
          if (cat.children_data && cat.children_data.length > 0) {
            acc.push(...flattenCategories(cat.children_data));
          }
          return acc;
        }, []);
      };
      const allCategories = flattenCategories(categoriesData.children_data || []);
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Fetch purchased products from orders
  const fetchPurchasedProducts = useCallback(async () => {
    const token = tmoApi.getTMOToken();
    if (!token) return;

    try {
      const orders = await tmoApi.getOrders(token);
      const ordersArray = Array.isArray(orders) ? orders : orders.items || [];
      const purchasedMap = new Map<string, PurchasedProductInfo[]>();

      ordersArray.forEach((order: any) => {
        const status = order.status?.toLowerCase();
        if (tmoApi.isOrderSuccess(status || "")) {
          order.items?.forEach((item: any) => {
            if (item.sku) {
              const { baseSku, licenseType } = tmoApi.parseLicenseSku(item.sku);
              const purchaseInfo: PurchasedProductInfo = {
                licenseType,
                orderId: order.increment_id || order.entity_id?.toString(),
                orderStatus: status,
              };
              const existing = purchasedMap.get(baseSku) || [];
              const hasLicense = existing.some((p) => p.licenseType === licenseType);
              if (!hasLicense) {
                existing.push(purchaseInfo);
                purchasedMap.set(baseSku, existing);
              }
            }
          });
        }
      });

      setPurchasedProducts(purchasedMap);
    } catch (err) {
      console.error("Error fetching purchased products:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchPurchasedProducts();
  }, [fetchCategories, fetchPurchasedProducts]);

  // Fetch products when category, search, or page changes
  useEffect(() => {
    fetchProducts(selectedCategoryId, searchQuery, currentPage);
  }, [selectedCategoryId, searchQuery, currentPage, fetchProducts]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page on category change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId]);

  // Available categories for filter chips
  const availableCategories = useMemo(() => {
    if (categories.length === 0) return [{ id: "all", name: t("store.all") }];
    const activeCategories = categories
      .filter((c) => c.is_active)
      .map((c) => ({ id: String(c.id), name: c.name }));
    return [{ id: "all", name: t("store.all") }, ...activeCategories];
  }, [categories, t]);

  // Category ID to name map (from loaded categories)
  const categoryIdMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => { map[String(c.id)] = c.name; });
    return map;
  }, [categories]);

  // Get category label for a product (skip root category)
  const getProductCategory = (product: MappedProduct): string => {
    if (!product.categoryIds?.length) return "";
    for (const catId of product.categoryIds) {
      const name = categoryIdMap[catId];
      if (name) return name;
    }
    return "";
  };

  // Purchase status helper
  const getProductPurchaseStatus = (product: MappedProduct) => {
    const purchases = purchasedProducts.get(product.sku) || [];
    const hasPersonal = purchases.some((p) => p.licenseType === "personal");
    const hasCommercial = purchases.some((p) => p.licenseType === "commercial");
    const hasUnknown = purchases.some((p) => p.licenseType === "unknown");
    const isFullyOwned = hasCommercial || hasUnknown || (hasPersonal && hasCommercial);
    const canUpgrade = hasPersonal && !hasCommercial;
    const isPurchased = purchases.length > 0;
    return { isPurchased, hasPersonal, hasCommercial, canUpgrade, isFullyOwned };
  };

  // Open license modal for a product
  const handleChooseLicense = (product: MappedProduct) => {
    setSelectedProduct(product);
    setLicenseModalOpen(true);
  };

  // Handle license selection — add to cart with correct option
  const handleSelectLicense = async (licenseType: "personal" | "commercial") => {
    if (!selectedProduct) return;

    setAddingToCart(true);
    try {
      // Build product option for selected license
      const licenseOption = selectedProduct.options?.find(
        (opt) => opt.title?.toLowerCase().includes("license"),
      );
      const extensionAttrs: TMOCartItemProductOption["extension_attributes"] = {};

      // Add license custom option
      if (licenseOption?.values) {
        const selectedOpt = licenseOption.values.find((v) =>
          v.title?.toLowerCase().includes(licenseType),
        );
        if (selectedOpt) {
          extensionAttrs.custom_options = [
            {
              option_id: String(licenseOption.option_id),
              option_value: String(selectedOpt.option_type_id),
            },
          ];
        }
      }

      // Add downloadable links for downloadable products
      const rawProduct = rawProducts.find((p) => p.sku === selectedProduct.sku);
      const downloadLinks = rawProduct?.extension_attributes?.downloadable_product_links;
      if (downloadLinks && downloadLinks.length > 0) {
        extensionAttrs.downloadable_option = {
          downloadable_links: downloadLinks.map((l: any) => l.id),
        };
      }

      const productOption: TMOCartItemProductOption | undefined =
        Object.keys(extensionAttrs).length > 0
          ? { extension_attributes: extensionAttrs }
          : undefined;

      await addToCart(selectedProduct.sku, 1, productOption);
      toast.success(`${selectedProduct.name} ${t("store.addedToCart")}`);
      setLicenseModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add item to cart";
      toast.error(errorMessage);
    } finally {
      setAddingToCart(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / STORE_PAGE_SIZE);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get personal license price for a product
  const getPersonalPrice = (product: MappedProduct): number => {
    const basePrice = product.price ?? 0;
    const licenseOption = product.options?.find(
      (opt) => opt.title?.toLowerCase().includes("license"),
    );
    if (licenseOption?.values) {
      const personalOpt = licenseOption.values.find((v) =>
        v.title?.toLowerCase().includes("personal"),
      );
      return basePrice + (personalOpt?.price ?? 0);
    }
    return basePrice;
  };

  // Get commercial license price for a product
  const getCommercialPrice = (product: MappedProduct): number => {
    const basePrice = product.price ?? 0;
    const licenseOption = product.options?.find(
      (opt) => opt.title?.toLowerCase().includes("license"),
    );
    if (licenseOption?.values) {
      const commercialOpt = licenseOption.values.find((v) =>
        v.title?.toLowerCase().includes("commercial"),
      );
      return basePrice + (commercialOpt?.price ?? 0);
    }
    return basePrice;
  };

  // Get image URL for a product
  const getProductImageUrl = (product: MappedProduct): string | null => {
    const imageAttr = product.custom_attributes?.find(
      (attr) => attr.attribute_code === "thumbnail",
    );
    return imageAttr?.value
      ? `${TMO_MEDIA_URL}${imageAttr.value}`
      : product.images[0] || null;
  };

  if (assetsLoading && products.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">{t("store.title")}</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyan-500 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Button>
            <Button
              onClick={() => setBecomeArtistOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              {t("store.becomeResidentArtist")}
            </Button>
          </div>
        </div>

        {/* Search + category filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t("store.searchPlaceholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-9 bg-background border-border"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category filter chips */}
          <div className="flex gap-2 flex-wrap items-center">
            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategoryId(selectedCategoryId === cat.id ? "all" : cat.id)
                }
                className={[
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  selectedCategoryId === cat.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground",
                ].join(" ")}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {totalCount} {totalCount === 1 ? t("store.asset") : t("store.assets")}{" "}
          {t("store.found")}
        </p>

        {/* Grid */}
        {assetsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => {
              const imageUrl = getProductImageUrl(product);
              const purchaseStatus = getProductPurchaseStatus(product);

              return (
                <div
                  key={product.sku}
                  className="group relative overflow-hidden rounded-xl cursor-pointer bg-muted aspect-[3/4]"
                  onClick={() =>
                    setLocation(`/product/${encodeURIComponent(product.sku)}`)
                  }
                >
                  {/* Image */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {t("store.noImage") || "No Image"}
                    </div>
                  )}

                  {/* Category badge */}
                  {getProductCategory(product) && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/50 text-white/90 backdrop-blur-sm">
                        {getProductCategory(product)}
                      </span>
                    </div>
                  )}

                  {/* Owned / Personal badge */}
                  {purchaseStatus.isFullyOwned && (
                    <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {t("store.owned") || "Owned"}
                    </div>
                  )}
                  {purchaseStatus.canUpgrade && (
                    <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {t("store.personalLicense")}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">
                      {product.name}
                    </p>
                    <p className="text-cyan-300 text-xs font-medium">
                      ¥{getPersonalPrice(product).toFixed(2)}
                    </p>

                    {/* Action button based on purchase status */}
                    {purchaseStatus.isFullyOwned ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="mt-2 w-full bg-green-600/10 border-green-600 text-green-600 text-xs h-7"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        {t("store.owned") || "Owned"}
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChooseLicense(product);
                        }}
                        disabled={addingToCart}
                        size="sm"
                        className="mt-2 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs py-1 h-7"
                      >
                        {addingToCart && selectedProduct?.sku === product.sku ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            {t("product.addToCart")}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <Search className="w-10 h-10 opacity-30" />
            <p className="text-lg font-medium">
              {t("store.noAssetsFound")}
            </p>
            <p className="text-sm">{t("store.adjustSearch")}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || assetsLoading}
            >
              {t("store.previous") || "Previous"}
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={assetsLoading}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || assetsLoading}
            >
              {t("store.next") || "Next"}
            </Button>

            <span className="text-sm text-muted-foreground ml-4">
              {currentPage} / {totalPages} ({totalCount})
            </span>
          </div>
        )}
      </div>

      <BecomeArtistModal
        open={becomeArtistOpen}
        onOpenChange={setBecomeArtistOpen}
      />

      <LicenseModal
        isOpen={licenseModalOpen}
        itemName={selectedProduct?.name ?? ""}
        personalPriceCNY={selectedProduct ? getPersonalPrice(selectedProduct) : 5}
        commercialPriceCNY={selectedProduct ? getCommercialPrice(selectedProduct) : 25}
        onClose={() => {
          setLicenseModalOpen(false);
          setSelectedProduct(null);
        }}
        onSelectLicense={handleSelectLicense}
        isLoading={addingToCart}
      />
    </DashboardLayout>
  );
}
