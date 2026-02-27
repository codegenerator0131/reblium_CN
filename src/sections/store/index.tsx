"use client";

import React, { useEffect, useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Search,
  X,
  ShoppingCart,
  Check,
  ArrowUpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { UserContext } from "@/provider/UserContext";
import { useCart } from "@/provider/CartContext";
import tmoApi from "@/lib/tmoApi";
import {
  TMOProduct,
  TMOCategory,
  MappedProduct,
  TMOProductOption,
} from "@/types/tmo";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import CartSidebar from "@/components/CartSidebar";
import ProductOptionsModal from "@/components/ProductOptionsModal";
import { TMOCartItemProductOption } from "@/types/tmo";

// License type for purchased products
type LicenseType = "personal" | "commercial" | "unknown";

interface PurchasedProductInfo {
  licenseType: LicenseType;
  orderId: string;
  orderStatus: string;
}

const TMO_IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_TMO_API_URL || "https://reblium.alpha.tmogroup.asia";

const StoreView: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { userInfo, isAuthenticated, refetchUserData, rolesData } =
    useContext(UserContext);
  const {
    addToCart,
    loading: cartLoading,
    itemsCount,
    setIsCartOpen,
  } = useCart();

  const [assetsLoading, setAssetsLoading] = useState(true);
  const [tmoProducts, setTmoProducts] = useState<MappedProduct[]>([]);
  const [categories, setCategories] = useState<TMOCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // For debounced search
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;
  const [isProductOptionsModalOpen, setIsProductOptionsModalOpen] =
    useState(false);
  const [selectedTmoProduct, setSelectedTmoProduct] =
    useState<MappedProduct | null>(null);
  // Map of base SKU -> purchased license info
  // A product can have multiple purchases (personal and commercial)
  const [purchasedProducts, setPurchasedProducts] = useState<
    Map<string, PurchasedProductInfo[]>
  >(new Map());

  // Fetch TMO products with server-side filtering
  const fetchTmoProducts = useCallback(
    async (categoryId?: string, search?: string, page: number = 1) => {
      setAssetsLoading(true);
      try {
        const filterGroups: {
          filters: { field: string; value: string; condition_type: string }[];
        }[] = [];

        // Add category filter
        if (categoryId && categoryId !== "all") {
          filterGroups.push({
            filters: [
              {
                field: "category_id",
                value: categoryId,
                condition_type: "eq",
              },
            ],
          });
        }

        // Add search filter
        if (search && search.trim()) {
          filterGroups.push({
            filters: [
              {
                field: "name",
                value: `%${search.trim()}%`,
                condition_type: "like",
              },
            ],
          });
        }

        const response = await tmoApi.getProducts({
          filter_groups: filterGroups.length > 0 ? filterGroups : undefined,
          page_size: pageSize,
          current_page: page,
        });

        const mapped = response.items.map((product) =>
          tmoApi.mapTMOProductToMapped(product, TMO_IMAGE_BASE_URL),
        );
        setTmoProducts(mapped);
        setTotalCount(response.total_count);
      } catch (error) {
        console.error("Error fetching TMO products:", error);
        toast.error("Failed to load products from TMO");
      } finally {
        setAssetsLoading(false);
      }
    },
    [pageSize],
  );

  // Fetch TMO categories
  const fetchTmoCategories = useCallback(async () => {
    try {
      const categoriesData = await tmoApi.getCategories();
      // Flatten category tree to get all categories
      const flattenCategories = (cats: TMOCategory[]): TMOCategory[] => {
        return cats.reduce<TMOCategory[]>((acc, cat) => {
          acc.push(cat);
          if (cat.children_data && cat.children_data.length > 0) {
            acc.push(...flattenCategories(cat.children_data));
          }
          return acc;
        }, []);
      };
      const allCategories = flattenCategories(
        categoriesData.children_data || [],
      );
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching TMO categories:", error);
    }
  }, []);

  // Helper function to extract base SKU and license type from purchased SKU
  const parsePurchasedSku = (
    sku: string,
  ): { baseSku: string; licenseType: LicenseType } => {
    const lowerSku = sku.toLowerCase();
    if (lowerSku.endsWith("-personal")) {
      return {
        baseSku: sku.slice(0, -9), // Remove "-personal"
        licenseType: "personal",
      };
    } else if (lowerSku.endsWith("-commercial")) {
      return {
        baseSku: sku.slice(0, -11), // Remove "-commercial"
        licenseType: "commercial",
      };
    }
    // If no suffix, treat as unknown (could be base product without license distinction)
    return { baseSku: sku, licenseType: "unknown" };
  };

  // Fetch purchased products from completed orders
  const fetchPurchasedProducts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const token = tmoApi.getTMOToken();
      if (!token) return;

      const orders = await tmoApi.getOrders(token);
      const ordersArray = Array.isArray(orders) ? orders : orders.items || [];

      // Map to track purchased products with their license types
      const purchasedMap = new Map<string, PurchasedProductInfo[]>();

      ordersArray.forEach((order: any) => {
        const status = order.status?.toLowerCase();
        // Include products from all orders except canceled/failed
        // This includes: processing, pending, complete, paid, etc.
        if (status === "complete" || status === "processing") {
          order.items?.forEach((item: any) => {
            if (item.sku) {
              const { baseSku, licenseType } = parsePurchasedSku(item.sku);
              const purchaseInfo: PurchasedProductInfo = {
                licenseType,
                orderId: order.increment_id || order.entity_id?.toString(),
                orderStatus: status,
              };

              const existing = purchasedMap.get(baseSku) || [];
              // Check if this license type is already recorded
              const hasLicense = existing.some(
                (p) => p.licenseType === licenseType,
              );
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
  }, [isAuthenticated]);

  // Initial load - fetch categories
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchTmoCategories();
    fetchPurchasedProducts();
    refetchUserData();
  }, [
    isAuthenticated,
    fetchTmoCategories,
    fetchPurchasedProducts,
    refetchUserData,
  ]);

  // Fetch products when category, search, or page changes (server-side filtering)
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchTmoProducts(selectedCategoryId, searchQuery, currentPage);
  }, [
    isAuthenticated,
    selectedCategoryId,
    searchQuery,
    currentPage,
    fetchTmoProducts,
  ]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId]);

  // Get available categories for tabs
  const getAvailableCategories = (): { id: string; name: string }[] => {
    if (categories.length > 0) {
      const activeCategories = categories
        .filter((c) => c.is_active && c.product_count > 0)
        .map((c) => ({ id: String(c.id), name: c.name }));
      return [{ id: "all", name: "All" }, ...activeCategories];
    }
    return [{ id: "all", name: "All" }];
  };

  // Helper to get purchase status for a product
  const getProductPurchaseStatus = (
    product: MappedProduct,
  ): {
    isPurchased: boolean;
    hasPersonal: boolean;
    hasCommercial: boolean;
    canUpgrade: boolean;
    isFullyOwned: boolean;
  } => {
    const purchases = purchasedProducts.get(product.sku) || [];
    const hasPersonal = purchases.some((p) => p.licenseType === "personal");
    const hasCommercial = purchases.some((p) => p.licenseType === "commercial");
    const hasUnknown = purchases.some((p) => p.licenseType === "unknown");

    // If product has unknown license (no personal/commercial distinction), treat as fully owned
    const isFullyOwned =
      hasCommercial || hasUnknown || (hasPersonal && hasCommercial);
    const canUpgrade = hasPersonal && !hasCommercial;
    const isPurchased = purchases.length > 0;

    return {
      isPurchased,
      hasPersonal,
      hasCommercial,
      canUpgrade,
      isFullyOwned,
    };
  };

  // Get items to display - TMO products (no longer filter out purchased)
  const getFilteredItems = (): MappedProduct[] => {
    // No longer filter out purchased products - we show them with status
    return tmoProducts;
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // State for upgrade modal
  const [isUpgradeMode, setIsUpgradeMode] = useState(false);

  // Handle add to TMO cart with options
  const handleAddToCart = async (
    product: MappedProduct,
    productOption?: TMOCartItemProductOption,
  ) => {
    try {
      await addToCart(product.sku, 1, productOption);
      toast.success(`${product.name} added to cart`);
      setIsProductOptionsModalOpen(false);
      setSelectedTmoProduct(null);
      setIsUpgradeMode(false);
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add item to cart";
      toast.error(errorMessage);
    }
  };

  // Check if product has required options
  const hasRequiredOptions = (product: MappedProduct): boolean => {
    return (
      product.options?.some((option) => option.is_require === true) ?? false
    );
  };

  const handleBuyClick = (product: MappedProduct) => {
    setIsUpgradeMode(false);
    // Check if product has required options
    if (hasRequiredOptions(product)) {
      // Show options modal
      setSelectedTmoProduct(product);
      setIsProductOptionsModalOpen(true);
    } else {
      // No required options - add directly to cart
      handleAddToCart(product);
    }
  };

  // Handle upgrade to commercial license
  const handleUpgradeClick = (product: MappedProduct) => {
    setIsUpgradeMode(true);
    setSelectedTmoProduct(product);
    setIsProductOptionsModalOpen(true);
  };

  const isLoading = assetsLoading;
  const availableCategories = getAvailableCategories();

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("store.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("store.subtitle")}
            </p>
          </div>

          {/* Cart Button */}
          <Button
            variant="outline"
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("store.search")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Tabs
          value={selectedCategoryId}
          onValueChange={setSelectedCategoryId}
          className="w-full"
        >
          <TabsList className="h-16 p-2 overflow-x-auto">
            {availableCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="capitalize text-2xl px-8 py-4 data-[state=active]:text-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {availableCategories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : getFilteredItems().length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {getFilteredItems().map((product) => {
                    const imageAttr = product.custom_attributes?.find(
                      (attr) => attr.attribute_code === "thumbnail",
                    );
                    const imageUrl = imageAttr?.value
                      ? `${process.env.NEXT_PUBLIC_TMO_MEDIA_URL}${imageAttr.value}`
                      : null;

                    // Get purchase status for this product
                    const purchaseStatus = getProductPurchaseStatus(product);

                    return (
                      <Card
                        key={product.sku}
                        className="overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() =>
                          router.push(`/store/${encodeURIComponent(product.sku)}`)
                        }
                      >
                        {/* Owned badge for fully owned products */}
                        {purchaseStatus.isFullyOwned && (
                          <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            {t("store.owned")}
                          </div>
                        )}
                        {/* Personal license badge for upgradable products */}
                        {purchaseStatus.canUpgrade && (
                          <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {t("store.personalLicense")}
                          </div>
                        )}

                        <div className="bg-muted flex items-center justify-center">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="max-w-full h-[280px] object-contain"
                            />
                          ) : (
                            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                              {t("store.noImage")}
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-2">
                          <h3 className="font-medium text-sm truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                          <div className="pt-3 border-t space-y-2">
                            <div className="text-center">
                              <span className="text-lg font-bold text-primary">
                                ${product.price?.toFixed(2) || "0.00"}
                              </span>
                            </div>

                            {/* Show different buttons based on purchase status */}
                            {purchaseStatus.isFullyOwned ? (
                              // Fully owned - show disabled "Owned" button
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="w-full h-8 bg-green-600/10 border-green-600 text-green-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                {t("store.owned")}
                              </Button>
                            ) : purchaseStatus.canUpgrade ? (
                              // Personal license - show upgrade button
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpgradeClick(product);
                                }}
                                disabled={cartLoading}
                                className="w-full h-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              >
                                {cartLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <ArrowUpCircle className="h-4 w-4 mr-2" />
                                    {t("store.upgradeToCommercial")}
                                  </>
                                )}
                              </Button>
                            ) : (
                              // Not purchased - show add to cart button
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBuyClick(product);
                                }}
                                disabled={cartLoading}
                                className="w-full h-8"
                              >
                                {cartLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    {t("store.addToCart")}
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  {searchInput.trim()
                    ? t("store.noItemsSearch")
                    : t("store.noItemsCategory")}
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
                    {t("store.previous")}
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
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
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
                    {t("store.next")}
                  </Button>

                  <span className="text-sm text-muted-foreground ml-4">
                    {t("store.pageInfo", {
                      current: currentPage,
                      total: totalPages,
                      items: totalCount,
                    })}
                  </span>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Product Options Modal (for TMO products with required options) */}
      {selectedTmoProduct &&
        (() => {
          // Extract image URL from custom attributes (same way as product cards)
          const imageAttr = selectedTmoProduct.custom_attributes?.find(
            (attr) => attr.attribute_code === "thumbnail",
          );
          const imageUrl = imageAttr?.value
            ? `${process.env.NEXT_PUBLIC_TMO_MEDIA_URL}${imageAttr.value}`
            : null;

          // Filter options for upgrade mode - only show commercial options
          let displayOptions = selectedTmoProduct.options || [];
          if (isUpgradeMode && displayOptions.length > 0) {
            // Filter option values to only include commercial license
            displayOptions = displayOptions.map((option) => {
              if (option.values && option.values.length > 0) {
                const commercialValues = option.values.filter((v) =>
                  v.title?.toLowerCase().includes("commercial"),
                );
                // If we found commercial options, use only those
                if (commercialValues.length > 0) {
                  return { ...option, values: commercialValues };
                }
              }
              return option;
            });
          }

          return (
            <ProductOptionsModal
              isOpen={isProductOptionsModalOpen}
              productName={selectedTmoProduct.name}
              productPrice={selectedTmoProduct.price}
              productImage={imageUrl || undefined}
              options={displayOptions}
              onClose={() => {
                setIsProductOptionsModalOpen(false);
                setSelectedTmoProduct(null);
                setIsUpgradeMode(false);
              }}
              onAddToCart={(productOption) =>
                handleAddToCart(selectedTmoProduct, productOption)
              }
              isLoading={cartLoading}
              isUpgradeMode={isUpgradeMode}
            />
          );
        })()}

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
};

export default StoreView;
