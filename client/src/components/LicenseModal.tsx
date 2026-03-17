import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LicenseModalProps {
  isOpen: boolean;
  itemName: string;
  personalPriceCNY?: number;
  commercialPriceCNY?: number;
  onClose: () => void;
  onSelectLicense: (licenseType: "personal" | "commercial") => void;
  isLoading?: boolean;
}

export default function LicenseModal({
  isOpen,
  itemName,
  personalPriceCNY = 36,
  commercialPriceCNY = 180,
  onClose,
  onSelectLicense,
  isLoading = false,
}: LicenseModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("license.chooseFor")} "{itemName}"</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          {/* Personal License */}
          <Card className="p-6 border-2 hover:border-cyan-500 transition-colors cursor-pointer">
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">¥{personalPriceCNY}</div>
                <p className="text-sm text-muted-foreground font-semibold">{t("license.personalTitle")}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{t("license.nonCommercialUse")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{t("license.personalProjectsOnly")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{t("license.textures2K")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{t("license.unlimitedExports")}</span>
                </div>
              </div>

              <Button
                onClick={() => onSelectLicense("personal")}
                disabled={isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              >
                {isLoading ? t("license.processing") : t("license.buyPersonal")}
              </Button>
            </div>
          </Card>

          {/* Commercial License */}
          <Card className="p-6 border-2 border-cyan-500 bg-cyan-500/5">
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">¥{commercialPriceCNY}</div>
                <p className="text-sm text-muted-foreground font-semibold">{t("license.commercialTitle")}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{t("license.commercialRights")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{t("license.paidProjects")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{t("license.textures4K")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{t("license.unlimitedExports")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{t("license.teamUse")}</span>
                </div>
              </div>

              <Button
                onClick={() => onSelectLicense("commercial")}
                disabled={isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              >
                {isLoading ? t("license.processing") : t("license.buyCommercial")}
              </Button>
            </div>
          </Card>
        </div>

        <div className="border-t pt-4 text-center text-sm text-muted-foreground">
          <p>
            <button className="text-cyan-400 hover:underline">{t("license.whatsDifference")}</button>
            {" • "}
            <button className="text-cyan-400 hover:underline">{t("license.alreadyPurchased")}</button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
