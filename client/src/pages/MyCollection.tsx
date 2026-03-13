import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Package, Calendar, Zap, Shield } from "lucide-react";
import { useState } from "react";
import { LicenseUpgradeModal } from "@/components/LicenseUpgradeModal";
import { toast } from "sonner";

export function MyCollection() {
  const { t, language } = useLanguage();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedItemForUpgrade, setSelectedItemForUpgrade] = useState<{
    id: number;
    name: string;
    currentLicense: "personal" | "commercial";
    upgradeCost: number;
    upgradeCostCNY: number;
  } | null>(null);

  const { data: purchases, isLoading, error } = trpc.collection.getPurchases.useQuery();
  const utils = trpc.useUtils();

  const upgradeLicenseMutation = trpc.collection.upgradeLicense.useMutation({
    onSuccess: () => {
      toast.success(t("collection.upgradeSuccess") || "License upgraded successfully!");
      utils.collection.getPurchases.invalidate();
      setUpgradeModalOpen(false);
      setSelectedItemForUpgrade(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout children={
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-cyan-500" />
          <h1 className="text-3xl font-bold">{t("nav.myCollection") || "My Collection"}</h1>
        </div>
        <div className="text-muted-foreground">{t('collection.loading')}</div>
      </div>
    } />
    );
  }

  if (error) {
    return (
      <DashboardLayout children={
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-cyan-500" />
          <h1 className="text-3xl font-bold">{t("nav.myCollection") || "My Collection"}</h1>
        </div>
        <div className="text-destructive">{t('collection.error')}: {error.message}</div>
      </div>
    } />
    );
  }

  const purchasedItems = purchases || [];

  const handleUpgradeClick = (purchase: any) => {
    if (purchase.licenseType === "commercial") {
      toast.info(t("collection.alreadyCommercial") || "Already has commercial license");
      return;
    }

    const personalPrice = 5;
    const commercialPrice = 25;
    const upgradeCost = commercialPrice - personalPrice;
    const upgradeCostCNY = upgradeCost * 7.2;

    setSelectedItemForUpgrade({
      id: purchase.id,
      name: (language === 'zh' && purchase.item?.nameCn ? purchase.item.nameCn : purchase.item?.name) || "Unknown Asset",
      currentLicense: purchase.licenseType,
      upgradeCost,
      upgradeCostCNY,
    });
    setUpgradeModalOpen(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedItemForUpgrade) return;

    await upgradeLicenseMutation.mutateAsync({
      userItemId: selectedItemForUpgrade.id,
      newLicenseType: "commercial",
    });
  };

  return (
    <DashboardLayout children={
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-cyan-500" />
            <div>
              <h1 className="text-3xl font-bold">{t("nav.myCollection") || "My Collection"}</h1>
              <p className="text-sm text-muted-foreground">
                {purchasedItems.length} {purchasedItems.length === 1 ? t("collection.asset") : t("collection.assets")} {t('collection.owned')}
              </p>
            </div>
          </div>
        </div>

        {purchasedItems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("collection.noAssets") || "No assets yet"}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("collection.visitStore") || "Visit the store to purchase your first asset"}
              </p>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                {t("collection.browseStore") || "Browse Store"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchasedItems.map((purchase) => (
              <Card key={purchase.id} className="overflow-hidden hover:border-cyan-500/50 transition-colors">
                {purchase.item?.thumbnailUrl && (
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={purchase.item.thumbnailUrl}
                      alt={purchase.item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {(language === 'zh' && purchase.item?.nameCn ? purchase.item.nameCn : purchase.item?.name) || t('common.unknownAsset') || "Unknown Asset"}
                      </CardTitle>
                      <CardDescription className="capitalize">
                        {purchase.item?.category || "Asset"}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={purchase.licenseType === "commercial" ? "default" : "secondary"}
                      className={
                        purchase.licenseType === "commercial"
                          ? "bg-cyan-500 text-black"
                          : ""
                      }
                    >
                      {purchase.licenseType === "commercial" ? t("store.commercial") || "Commercial" : t("store.personal") || "Personal"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Asset Details */}
                  <div className="space-y-2 text-sm">
                    {purchase.item?.polyCount && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        <span>{t('product.polyCount')}: {purchase.item.polyCount.toLocaleString()}</span>
                      </div>
                    )}
                    {purchase.item?.fileFormat && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{t('product.fileFormat')}: {purchase.item.fileFormat}</span>
                      </div>
                    )}
                    {purchase.item?.fileSize && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{t('product.fileSize')}: {(purchase.item.fileSize / 1024).toFixed(2)} MB</span>
                      </div>
                    )}
                    {purchase.item?.textureTypes && (
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium">{t('product.textureMaps')}:</p>
                        <div className="flex flex-wrap gap-1">
                          {typeof purchase.item.textureTypes === "string"
                            ? JSON.parse(purchase.item.textureTypes).map((type: string) => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {type}
                                </Badge>
                              ))
                            : null}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Purchase Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {t('collection.purchased')}{" "}
                      {new Date(purchase.purchasedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* License Type Switcher */}
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground">{t("collection.licenseType") || "License Type"}:</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={purchase.licenseType === "personal" ? "default" : "outline"}
                        className={`flex-1 gap-1 ${
                          purchase.licenseType === "personal"
                            ? "bg-cyan-500 hover:bg-cyan-600 text-black"
                            : ""
                        }`}
                        disabled={true}
                      >
                        <Shield className="h-3 w-3" />
                        {t("store.personal") || "Personal"}
                      </Button>
                      <Button
                        size="sm"
                        variant={purchase.licenseType === "commercial" ? "default" : "outline"}
                        className={`flex-1 gap-1 ${
                          purchase.licenseType === "commercial"
                            ? "bg-cyan-500 hover:bg-cyan-600 text-black"
                            : ""
                        }`}
                        onClick={() => handleUpgradeClick(purchase)}
                        disabled={purchase.licenseType === "commercial"}
                      >
                        <Shield className="h-3 w-3" />
                        {t("store.commercial") || "Commercial"}
                      </Button>
                    </div>
                    {purchase.licenseType === "personal" && (
                      <p className="text-xs text-cyan-500 font-medium">
                        {t("collection.upgradeFor")} $20 / ¥144
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <LicenseUpgradeModal
          open={upgradeModalOpen}
          onOpenChange={setUpgradeModalOpen}
          itemName={selectedItemForUpgrade?.name || ""}
          currentLicense={selectedItemForUpgrade?.currentLicense || "personal"}
          upgradeCost={selectedItemForUpgrade?.upgradeCost || 0}
          upgradeCostCNY={selectedItemForUpgrade?.upgradeCostCNY || 0}
          onConfirm={handleConfirmUpgrade}
          isLoading={upgradeLicenseMutation.isPending}
        />
      </div>
    } />
  );
}
