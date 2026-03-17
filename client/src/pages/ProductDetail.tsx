import { useParams, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ImageCarousel from "@/components/ImageCarousel";
import tmoApi, { TMO_MEDIA_URL } from "@/lib/tmoApi";
import type { TMOProduct, TMOCartItemProductOption } from "@/types/tmo";

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
  const { sku } = useParams<{ sku: string }>();
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const { addToCart, loading: cartLoading } = useCart();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<TMOProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<"personal" | "commercial">("personal");

  // Fetch product detail
  useEffect(() => {
    const fetchProduct = async () => {
      if (!sku) return;
      setLoading(true);
      setError(null);
      try {
        const decodedSku = decodeURIComponent(sku);
        const tmoProduct = await tmoApi.getProductDetail(decodedSku);
        setProduct(tmoProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(t("product.notFound"));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku, t]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">{error || t("product.notFound")}</h1>
            <Button onClick={() => setLocation("/store")}>{t("product.backToStore")}</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Helper to get custom attribute value
  const getAttr = (code: string): string | undefined =>
    product.custom_attributes?.find((a) => a.attribute_code === code)?.value;

  // Description (strip HTML)
  const descriptionRaw = getAttr("description") || "";
  const description = descriptionRaw.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

  // Category from category_links
  const categoryIds = product.extension_attributes?.category_links?.map((l) => l.category_id) || [];
  // We'll derive category name from the first category link — map known IDs to names
  // These IDs come from the /categories API response
  const CATEGORY_ID_MAP: Record<string, string> = {
    "42": "clothing",
    "46": "hair",
    "41": "face",
    "43": "accessories",
    "44": "animations",
    "45": "packs",
    "47": "fantasy",
    "48": "sci-fi",
  };
  const categoryName = categoryIds
    .map((id) => CATEGORY_ID_MAP[id])
    .find((name) => name !== undefined) || "";

  // Pricing from options
  const basePrice = product.price ?? 0;
  const licenseOption = product.options?.find(
    (opt) => opt.title?.toLowerCase().includes("license"),
  );
  let personalPrice = basePrice;
  let commercialPrice = basePrice;
  if (licenseOption?.values) {
    const personalOpt = licenseOption.values.find((v) =>
      v.title?.toLowerCase().includes("personal"),
    );
    const commercialOpt = licenseOption.values.find((v) =>
      v.title?.toLowerCase().includes("commercial"),
    );
    personalPrice = basePrice + (personalOpt?.price ?? 0);
    commercialPrice = basePrice + (commercialOpt?.price ?? 0);
  }

  // Tech specs from custom_attributes
  const polyCountStr = getAttr("polygon_count");
  const polyCount = polyCountStr ? parseInt(polyCountStr, 10) : 0;
  const fileFormat = getAttr("file_format") || "";
  const fileSizeStr = getAttr("file_size") || "";
  const textureMapsRaw = product.custom_attributes?.find((a) => a.attribute_code === "texture_maps_included")?.value;
  let textureTypes: string[] = [];
  if (textureMapsRaw) {
    if (Array.isArray(textureMapsRaw)) {
      textureTypes = textureMapsRaw;
    } else if (typeof textureMapsRaw === "string") {
      try {
        const parsed = JSON.parse(textureMapsRaw);
        textureTypes = Array.isArray(parsed) ? parsed : [];
      } catch {
        textureTypes = textureMapsRaw.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
  }

  // Images from media_gallery_entries
  const images = (product.media_gallery_entries || [])
    .filter((e) => !e.disabled)
    .sort((a, b) => a.position - b.position)
    .map((e) => `${TMO_MEDIA_URL}${e.file}`);

  const handleAddToCart = async () => {
    const extensionAttrs: TMOCartItemProductOption["extension_attributes"] = {};

    // Add license custom option
    if (licenseOption?.values) {
      const selectedOpt = licenseOption.values.find((v) =>
        v.title?.toLowerCase().includes(selectedLicense),
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
    const downloadLinks = product.extension_attributes?.downloadable_product_links;
    if (downloadLinks && downloadLinks.length > 0) {
      extensionAttrs.downloadable_option = {
        downloadable_links: downloadLinks.map((l) => l.id),
      };
    }

    const productOption: TMOCartItemProductOption | undefined =
      Object.keys(extensionAttrs).length > 0
        ? { extension_attributes: extensionAttrs }
        : undefined;

    try {
      await addToCart(product.sku, 1, productOption);
      toast.success(t("store.addedToCart"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add to cart");
    }
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
          {t("product.backToStore")}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Carousel */}
          <div className="flex items-center justify-center">
            <ImageCarousel
              images={images}
              alt={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              {categoryName && (
                <Badge className="mb-2 bg-cyan-500 text-black">
                  {language === "zh"
                    ? (CATEGORY_LABELS_ZH[categoryName] ?? categoryName.toUpperCase())
                    : categoryName.toUpperCase()}
                </Badge>
              )}
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("store.personalLicense")}:</span>
                  <span className="text-lg font-bold text-cyan-400">
                    ¥{personalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("store.commercialLicense")}:</span>
                  <span className="text-lg font-bold text-cyan-400">
                    ¥{commercialPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t("product.techSpecs")}</h2>

              {/* Poly Count */}
              {polyCount > 0 && (
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("product.polyCount")}:</span>
                    <span className="font-semibold">
                      {polyCount.toLocaleString()} {t("product.polygons")}
                    </span>
                  </div>
                </Card>
              )}

              {/* File Format */}
              {fileFormat && (
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("product.fileFormat")}:</span>
                    <Badge variant="outline">{fileFormat}</Badge>
                  </div>
                </Card>
              )}

              {/* File Size */}
              {fileSizeStr && (
                <Card className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t("product.fileSize")}:</span>
                    <span className="font-semibold">{fileSizeStr}</span>
                  </div>
                </Card>
              )}

              {/* Texture Types */}
              {textureTypes.length > 0 && (
                <Card className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">{t("product.textureMaps")}:</h3>
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
              <h3 className="font-semibold">{t("product.chooseLicense")}:</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedLicense === "personal" ? "default" : "outline"}
                  onClick={() => setSelectedLicense("personal")}
                  className={selectedLicense === "personal" ? "bg-cyan-500 hover:bg-cyan-600 text-black" : ""}
                >
                  {t("store.personal")}
                </Button>
                <Button
                  variant={selectedLicense === "commercial" ? "default" : "outline"}
                  onClick={() => setSelectedLicense("commercial")}
                  className={selectedLicense === "commercial" ? "bg-cyan-500 hover:bg-cyan-600 text-black" : ""}
                >
                  {t("store.commercial")}
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartLoading ? t("product.adding") : t("product.addToCart")}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
