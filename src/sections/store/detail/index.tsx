"use client";

import React, { useEffect, useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  ShoppingCart,
  Check,
  ArrowUpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { UserContext } from "@/provider/UserContext";
import { useCart } from "@/provider/CartContext";
import tmoApi from "@/lib/tmoApi";
import { MappedProduct, TMOCartItemProductOption } from "@/types/tmo";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import ImageGallery from "@/components/ImageGallery";
import ProductOptionsModal from "@/components/ProductOptionsModal";
import CartSidebar from "@/components/CartSidebar";

const TMO_IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_TMO_API_URL || "https://reblium.alpha.tmogroup.asia";

// License type for purchased products
type LicenseType = "personal" | "commercial" | "unknown";

interface PurchasedProductInfo {
  licenseType: LicenseType;
  orderId: string;
  orderStatus: string;
}

interface ProductDetailViewProps {
  sku: string;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ sku }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { isAuthenticated } = useContext(UserContext);
  const {
    addToCart,
    loading: cartLoading,
    itemsCount,
    setIsCartOpen,
  } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<MappedProduct | null>(null);
  const [isProductOptionsModalOpen, setIsProductOptionsModalOpen] =
    useState(false);
  const [isUpgradeMode, setIsUpgradeMode] = useState(false);

  // Purchase status
  const [purchasedProducts, setPurchasedProducts] = useState<
    Map<string, PurchasedProductInfo[]>
  >(new Map());

  // Helper function to extract base SKU and license type from purchased SKU
  const parsePurchasedSku = (
    purchasedSku: string
  ): { baseSku: string; licenseType: LicenseType } => {
    const lowerSku = purchasedSku.toLowerCase();
    if (lowerSku.endsWith("-personal")) {
      return {
        baseSku: purchasedSku.slice(0, -9),
        licenseType: "personal",
      };
    } else if (lowerSku.endsWith("-commercial")) {
      return {
        baseSku: purchasedSku.slice(0, -11),
        licenseType: "commercial",
      };
    }
    return { baseSku: purchasedSku, licenseType: "unknown" };
  };

  // Fetch purchased products from completed orders
  const fetchPurchasedProducts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const token = tmoApi.getTMOToken();
      if (!token) return;

      const orders = await tmoApi.getOrders(token);
      const ordersArray = Array.isArray(orders) ? orders : orders.items || [];

      const purchasedMap = new Map<string, PurchasedProductInfo[]>();

      ordersArray.forEach((order: any) => {
        const status = order.status?.toLowerCase();
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
              const hasLicense = existing.some(
                (p) => p.licenseType === licenseType
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

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const decodedSku = decodeURIComponent(sku);
        const tmoProduct = await tmoApi.getProductDetail(decodedSku);
        const mapped = tmoApi.mapTMOProductToMapped(
          tmoProduct,
          TMO_IMAGE_BASE_URL
        );
        setProduct(mapped);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(t("productDetail.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchPurchasedProducts();
  }, [sku, fetchPurchasedProducts, t]);

  // Get purchase status for the current product
  const getProductPurchaseStatus = () => {
    if (!product) return { isPurchased: false, hasPersonal: false, hasCommercial: false, canUpgrade: false, isFullyOwned: false };

    const purchases = purchasedProducts.get(product.sku) || [];
    const hasPersonal = purchases.some((p) => p.licenseType === "personal");
    const hasCommercial = purchases.some((p) => p.licenseType === "commercial");
    const hasUnknown = purchases.some((p) => p.licenseType === "unknown");

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

  // Check if product has required options
  const hasRequiredOptions = (prod: MappedProduct): boolean => {
    return prod.options?.some((option) => option.is_require === true) ?? false;
  };

  // Handle add to cart
  const handleAddToCart = async (
    prod: MappedProduct,
    productOption?: TMOCartItemProductOption
  ) => {
    try {
      await addToCart(prod.sku, 1, productOption);
      toast.success(`${prod.name} added to cart`);
      setIsProductOptionsModalOpen(false);
      setIsUpgradeMode(false);
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add item to cart";
      toast.error(errorMessage);
    }
  };

  const handleBuyClick = () => {
    if (!product) return;
    setIsUpgradeMode(false);
    if (hasRequiredOptions(product)) {
      setIsProductOptionsModalOpen(true);
    } else {
      handleAddToCart(product);
    }
  };

  const handleUpgradeClick = () => {
    if (!product) return;
    setIsUpgradeMode(true);
    setIsProductOptionsModalOpen(true);
  };

  const purchaseStatus = getProductPurchaseStatus();

  // Build image array for gallery - use same format as store page
  const getProductImages = (): string[] => {
    if (!product) return [];

    const images: string[] = [];

    // Get thumbnail from custom attributes (same as store page)
    const thumbnailAttr = product.custom_attributes?.find(
      (attr) => attr.attribute_code === "thumbnail"
    );
    if (thumbnailAttr?.value) {
      images.push(`${process.env.NEXT_PUBLIC_TMO_MEDIA_URL}${thumbnailAttr.value}`);
    }

    // Add additional images from media gallery if any (with same base URL)
    if (product.custom_attributes) {
      const imageAttr = product.custom_attributes.find(
        (attr) => attr.attribute_code === "image"
      );
      if (imageAttr?.value && imageAttr.value !== thumbnailAttr?.value) {
        images.push(`${process.env.NEXT_PUBLIC_TMO_MEDIA_URL}${imageAttr.value}`);
      }

      const smallImageAttr = product.custom_attributes.find(
        (attr) => attr.attribute_code === "small_image"
      );
      if (smallImageAttr?.value && smallImageAttr.value !== thumbnailAttr?.value && smallImageAttr.value !== imageAttr?.value) {
        images.push(`${process.env.NEXT_PUBLIC_TMO_MEDIA_URL}${smallImageAttr.value}`);
      }
    }

    return images;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/store")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-foreground">{t("productDetail.backToStore")}</span>
        </Button>
        <Card className="p-8 text-center">
          <p className="text-destructive">{error || t("productDetail.loadError")}</p>
          <Button className="mt-4" onClick={() => router.push("/store")}>
            {t("productDetail.backToStore")}
          </Button>
        </Card>
      </div>
    );
  }

  // Get description HTML attribute for full description
  const descriptionHtml = product.custom_attributes?.find(
    (attr) => attr.attribute_code === "description"
  )?.value;

  return (
    <>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/store")}>
            <ArrowLeft className="h-4 w-4 mr-2 text-foreground" />
            <span className="text-foreground">{t("productDetail.backToStore")}</span>
          </Button>

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

        {/* Product Content */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={getProductImages()} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and badges */}
            <div>
              {purchaseStatus.isFullyOwned && (
                <div className="inline-flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full mb-2">
                  <Check className="h-3 w-3" />
                  {t("store.owned")}
                </div>
              )}
              {purchaseStatus.canUpgrade && (
                <div className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded-full mb-2">
                  {t("store.personalLicense")}
                </div>
              )}
              <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-primary">
              ${product.price?.toFixed(2) || "0.00"}
            </div>

            {/* Description */}
            <div className="space-y-2">
              {descriptionHtml ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              ) : (
                product.description && (
                  <p className="text-foreground">{product.description}</p>
                )
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              {purchaseStatus.isFullyOwned ? (
                <Button
                  size="lg"
                  variant="outline"
                  disabled
                  className="w-full bg-green-600/10 border-green-600 text-green-600"
                >
                  <Check className="h-5 w-5 mr-2" />
                  {t("store.owned")}
                </Button>
              ) : purchaseStatus.canUpgrade ? (
                <Button
                  size="lg"
                  onClick={handleUpgradeClick}
                  disabled={cartLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {cartLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ArrowUpCircle className="h-5 w-5 mr-2" />
                      {t("store.upgradeToCommercial")}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleBuyClick}
                  disabled={cartLoading}
                  className="w-full"
                >
                  {cartLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {t("productDetail.addToCart")}
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Additional Info */}
            {product.is_pack && (
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-foreground font-medium">
                  {t("store.pack")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("store.itemsIncluded")}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Product Options Modal */}
      {product && (() => {
        const imageAttr = product.custom_attributes?.find(
          (attr) => attr.attribute_code === "thumbnail"
        );
        const imageUrl = imageAttr?.value
          ? `${process.env.NEXT_PUBLIC_TMO_MEDIA_URL}${imageAttr.value}`
          : null;

        let displayOptions = product.options || [];
        if (isUpgradeMode && displayOptions.length > 0) {
          displayOptions = displayOptions.map((option) => {
            if (option.values && option.values.length > 0) {
              const commercialValues = option.values.filter((v) =>
                v.title?.toLowerCase().includes("commercial")
              );
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
            productName={product.name}
            productPrice={product.price}
            productImage={imageUrl || undefined}
            options={displayOptions}
            onClose={() => {
              setIsProductOptionsModalOpen(false);
              setIsUpgradeMode(false);
            }}
            onAddToCart={(productOption) => handleAddToCart(product, productOption)}
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

export default ProductDetailView;
