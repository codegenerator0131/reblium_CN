import DashboardLayout from "@/components/DashboardLayout";
import LicenseModal from "@/components/LicenseModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Package, Calendar, Zap, Shield, Loader2, Search } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import tmoApi, { TMO_MEDIA_URL, type LicenseType } from "@/lib/tmoApi";
import type { TMOProduct, TMOCartItemProductOption } from "@/types/tmo";

interface OwnedAsset {
  sku: string;
  name: string;
  description: string;
  licenseType: LicenseType;
  imageUrl: string | null;
  category: string;
  purchasedAt: string;
  orderId: string;
  // Product details from custom_attributes
  polyCount: number;
  fileFormat: string;
  fileSize: string;
  textureTypes: string[];
  // Raw product for upgrade flow
  rawProduct?: TMOProduct;
}

export function MyCollection() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { addToCart, loading: cartLoading } = useCart();

  const [ownedAssets, setOwnedAssets] = useState<OwnedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Upgrade modal
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<OwnedAsset | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchOwnedAssets = useCallback(async () => {
    const token = tmoApi.getTMOToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Fetch orders and products in parallel
      const [ordersResponse, productsResponse] = await Promise.all([
        tmoApi.getOrders(token),
        tmoApi.getProducts({ page_size: 100 }),
      ]);

      const ordersArray = Array.isArray(ordersResponse)
        ? ordersResponse
        : ordersResponse.items || [];

      // Build a map of SKU -> product for quick lookup
      const productMap = new Map<string, TMOProduct>();
      productsResponse.items.forEach((p) => productMap.set(p.sku, p));

      // Collect owned assets from successful orders
      const assetsMap = new Map<string, OwnedAsset>();

      ordersArray.forEach((order: any) => {
        const status = order.status?.toLowerCase();
        if (!tmoApi.isOrderSuccess(status || "")) return;

        order.items?.forEach((item: any) => {
          if (!item.sku) return;

          const { baseSku, licenseType } = tmoApi.parseLicenseSku(item.sku);

          // If we already have this asset with a commercial license, skip
          const existing = assetsMap.get(baseSku);
          if (existing?.licenseType === "commercial") return;
          // If upgrading from personal to commercial
          if (existing && licenseType === "commercial") {
            existing.licenseType = "commercial";
            return;
          }
          if (existing) return;

          // Find the product details
          const product = productMap.get(baseSku);
          const customAttrs = product?.custom_attributes || [];

          const getAttr = (code: string) =>
            customAttrs.find((a) => a.attribute_code === code)?.value;

          const thumbnailValue = getAttr("thumbnail");
          const imageUrl = thumbnailValue ? `${TMO_MEDIA_URL}${thumbnailValue}` : null;

          const descriptionHtml = getAttr("description") || "";
          const description = tmoApi.stripHtml(descriptionHtml);

          const polyCountStr = getAttr("polygon_count");
          const polyCount = polyCountStr ? parseInt(polyCountStr, 10) : 0;

          const fileFormat = getAttr("file_format") || "";
          const fileSize = getAttr("file_size") || "";

          const textureMapsRaw = getAttr("texture_maps_included");
          let textureTypes: string[] = [];
          if (Array.isArray(textureMapsRaw)) {
            textureTypes = textureMapsRaw;
          } else if (typeof textureMapsRaw === "string" && textureMapsRaw) {
            try {
              textureTypes = JSON.parse(textureMapsRaw);
            } catch {
              textureTypes = textureMapsRaw.split(",").map((s) => s.trim());
            }
          }

          assetsMap.set(baseSku, {
            sku: baseSku,
            name: product?.name || item.name || baseSku,
            description,
            licenseType,
            imageUrl,
            category: "", // Will be resolved if needed
            purchasedAt: order.created_at || "",
            orderId: order.increment_id || order.entity_id?.toString() || "",
            polyCount,
            fileFormat,
            fileSize,
            textureTypes,
            rawProduct: product,
          });
        });
      });

      setOwnedAssets(Array.from(assetsMap.values()));
    } catch (error) {
      console.error("Error fetching owned assets:", error);
      toast.error(t("collection.error") || "Failed to load collection");
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchOwnedAssets();
  }, [fetchOwnedAssets]);

  // Filter by search
  const filteredAssets = ownedAssets.filter((asset) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      asset.name.toLowerCase().includes(q) ||
      asset.sku.toLowerCase().includes(q)
    );
  });

  // Upgrade handler
  const handleUpgradeClick = (asset: OwnedAsset) => {
    if (asset.licenseType === "commercial") {
      toast.info(t("collection.alreadyCommercial") || "Already has commercial license");
      return;
    }
    setSelectedAsset(asset);
    setLicenseModalOpen(true);
  };

  // Get prices from product options
  const getPrice = (asset: OwnedAsset, type: "personal" | "commercial"): number => {
    const product = asset.rawProduct;
    if (!product) return 0;
    const basePrice = product.price ?? 0;
    const licenseOption = product.options?.find((opt) =>
      opt.title?.toLowerCase().includes("license"),
    );
    if (licenseOption?.values) {
      const opt = licenseOption.values.find((v) =>
        v.title?.toLowerCase().includes(type),
      );
      return basePrice + (opt?.price ?? 0);
    }
    return basePrice;
  };

  const handleSelectLicense = async (licenseType: "personal" | "commercial") => {
    if (!selectedAsset?.rawProduct) return;

    setAddingToCart(true);
    try {
      const product = selectedAsset.rawProduct;
      const licenseOption = product.options?.find((opt) =>
        opt.title?.toLowerCase().includes("license"),
      );

      const extensionAttrs: TMOCartItemProductOption["extension_attributes"] = {};

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

      const downloadLinks = product.extension_attributes?.downloadable_product_links;
      if (downloadLinks && downloadLinks.length > 0) {
        extensionAttrs.downloadable_option = {
          downloadable_links: downloadLinks.map((l: any) => l.id),
        };
      }

      const productOption: TMOCartItemProductOption | undefined =
        Object.keys(extensionAttrs).length > 0
          ? { extension_attributes: extensionAttrs }
          : undefined;

      await addToCart(selectedAsset.sku, 1, productOption);
      toast.success(`${selectedAsset.name} ${t("store.addedToCart")}`);
      setLicenseModalOpen(false);
      setSelectedAsset(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to add to cart";
      toast.error(msg);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-cyan-500" />
            <div>
              <h1 className="text-3xl font-bold">{t("nav.myCollection")}</h1>
              {!loading && (
                <p className="text-sm text-muted-foreground">
                  {ownedAssets.length} {ownedAssets.length === 1 ? t("collection.asset") : t("collection.assets")} {t("collection.owned")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        {ownedAssets.length > 0 && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("collection.searchPlaceholder") || "Search your collection..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        ) : filteredAssets.length === 0 && ownedAssets.length === 0 ? (
          /* Empty State */
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("collection.noAssets")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("collection.visitStore")}
              </p>
              <Button
                onClick={() => navigate("/store")}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              >
                {t("collection.browseStore")}
              </Button>
            </CardContent>
          </Card>
        ) : filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
            <Search className="w-10 h-10 opacity-30" />
            <p className="text-lg font-medium">{t("store.noAssetsFound")}</p>
          </div>
        ) : (
          /* Assets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <Card key={asset.sku} className="overflow-hidden hover:border-cyan-500/50 transition-colors">
                {asset.imageUrl && (
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{asset.name}</CardTitle>
                      {asset.description && (
                        <CardDescription className="line-clamp-2">{asset.description}</CardDescription>
                      )}
                    </div>
                    <Badge
                      variant={asset.licenseType === "commercial" ? "default" : "secondary"}
                      className={asset.licenseType === "commercial" ? "bg-cyan-500 text-black" : ""}
                    >
                      {asset.licenseType === "commercial"
                        ? t("store.commercial")
                        : asset.licenseType === "personal"
                          ? t("store.personal")
                          : t("store.personal")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Asset Details */}
                  <div className="space-y-2 text-sm">
                    {asset.polyCount > 0 && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        <span>{t("product.polyCount")}: {asset.polyCount.toLocaleString()}</span>
                      </div>
                    )}
                    {asset.fileFormat && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{t("product.fileFormat")}: {asset.fileFormat}</span>
                      </div>
                    )}
                    {asset.fileSize && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{t("product.fileSize")}: {asset.fileSize}</span>
                      </div>
                    )}
                    {asset.textureTypes.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium">{t("product.textureMaps")}:</p>
                        <div className="flex flex-wrap gap-1">
                          {asset.textureTypes.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Purchase Date & Order */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {t("collection.purchased")}{" "}
                      {new Date(asset.purchasedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {asset.orderId && (
                      <span className="ml-auto text-muted-foreground">
                        #{asset.orderId}
                      </span>
                    )}
                  </div>

                  {/* License Type */}
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("collection.licenseType")}:
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={asset.licenseType === "personal" || asset.licenseType === "unknown" ? "default" : "outline"}
                        className={`flex-1 gap-1 ${
                          asset.licenseType === "personal" || asset.licenseType === "unknown"
                            ? "bg-cyan-500 hover:bg-cyan-600 text-black"
                            : ""
                        }`}
                        disabled
                      >
                        <Shield className="h-3 w-3" />
                        {t("store.personal")}
                      </Button>
                      <Button
                        size="sm"
                        variant={asset.licenseType === "commercial" ? "default" : "outline"}
                        className={`flex-1 gap-1 ${
                          asset.licenseType === "commercial"
                            ? "bg-cyan-500 hover:bg-cyan-600 text-black"
                            : ""
                        }`}
                        onClick={() => handleUpgradeClick(asset)}
                        disabled={asset.licenseType === "commercial"}
                      >
                        <Shield className="h-3 w-3" />
                        {t("store.commercial")}
                      </Button>
                    </div>
                    {asset.licenseType === "personal" && (
                      <p className="text-xs text-cyan-500 font-medium">
                        {t("collection.upgradeFor")} ¥{asset.rawProduct ? getPrice(asset, "commercial") - getPrice(asset, "personal") : 0}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <LicenseModal
        isOpen={licenseModalOpen}
        itemName={selectedAsset?.name ?? ""}
        personalPriceCNY={selectedAsset ? getPrice(selectedAsset, "personal") : 5}
        commercialPriceCNY={selectedAsset ? getPrice(selectedAsset, "commercial") : 25}
        upgradePriceCNY={selectedAsset ? getPrice(selectedAsset, "commercial") - getPrice(selectedAsset, "personal") : 0}
        onClose={() => {
          setLicenseModalOpen(false);
          setSelectedAsset(null);
        }}
        onSelectLicense={handleSelectLicense}
        isLoading={addingToCart}
        upgradeOnly
      />
    </DashboardLayout>
  );
}
