import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle, Shield, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LicenseUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  currentLicense: "personal" | "commercial";
  upgradeCost: number;
  upgradeCostCNY: number;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function LicenseUpgradeModal({
  open,
  onOpenChange,
  itemName,
  currentLicense,
  upgradeCost,
  upgradeCostCNY,
  onConfirm,
  isLoading = false,
}: LicenseUpgradeModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-500" />
            {t("collection.upgradeTitle") || "Upgrade License"}
          </DialogTitle>
          <DialogDescription>
            {t("collection.upgradeDescription") || "Upgrade your license to unlock commercial use"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Item Name */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium text-muted-foreground">
              {t("collection.item") || "Item"}
            </p>
            <p className="text-lg font-semibold">{itemName}</p>
          </div>

          {/* Current License */}
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("collection.currentLicense") || "Current License"}
              </p>
              <p className="capitalize">
                {currentLicense === "personal"
                  ? t("store.personal") || "Personal"
                  : t("store.commercial") || "Commercial"}
              </p>
            </div>
          </div>

          {/* Upgrade Info */}
          <div className="flex items-start gap-3 rounded-lg bg-cyan-500/10 p-3">
            <AlertCircle className="h-5 w-5 text-cyan-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">
                {t("collection.upgradeToCommercial") || "Upgrade to Commercial License"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("collection.commercialBenefits") ||
                  "Use this asset in commercial projects, games, and products"}
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {t("collection.upgradeCost") || "Upgrade Cost"}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-cyan-500">${upgradeCost.toFixed(2)}</span>
              <span className="text-lg text-muted-foreground">/ ¥{upgradeCostCNY.toFixed(0)}</span>
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-lg bg-yellow-500/10 p-3 border border-yellow-500/20">
            <p className="text-xs text-yellow-700 dark:text-yellow-400">
              {t("collection.upgradeWarning") ||
                "This will charge your account the upgrade cost. The license will be permanently upgraded."}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t("common.cancel") || "Cancel"}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {t("common.processing") || "Processing..."}
              </>
            ) : (
              t("collection.confirmUpgrade") || "Confirm Upgrade"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
