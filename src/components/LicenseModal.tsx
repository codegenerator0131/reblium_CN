import { Button } from "./Button";
import { Card } from "./Card";
import { Check, X, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LicenseModalProps {
  isOpen: boolean;
  itemName: string;
  personalCredits?: number;
  commercialCredits?: number;
  currentLicense?: "personal" | "commercial" | null;
  isOwned?: boolean;
  onClose: () => void;
  onSelectLicense: (licenseType: "personal" | "commercial") => void;
  isLoading?: boolean;
}

function LicenseModal({
  isOpen,
  itemName,
  personalCredits = 500,
  commercialCredits = 2000,
  currentLicense = null,
  isOwned = false,
  onClose,
  onSelectLicense,
  isLoading = false,
}: LicenseModalProps) {
  const { t } = useTranslation("common");

  if (!isOpen) return null;

  const creditDifference = commercialCredits - personalCredits;
  const isUpgrading = currentLicense === "personal";
  const hasCommercialLicense = currentLicense === "commercial";

  const getButtonText = (licenseType: "personal" | "commercial") => {
    if (!isOwned) {
      return licenseType === "personal"
        ? t("licenseModal.buyPersonal")
        : t("licenseModal.buyCommercial");
    }

    if (currentLicense === licenseType) {
      return t("licenseModal.currentLicense");
    }

    if (licenseType === "commercial") {
      return t("licenseModal.upgrade", { credits: creditDifference });
    } else {
      // Downgrade is not allowed
      return t("licenseModal.notAvailable");
    }
  };

  const getCardClassName = (licenseType: "personal" | "commercial") => {
    const baseClass = "p-6 border-2 transition-colors";

    if (currentLicense === licenseType) {
      return `${baseClass} border-primary bg-primary/10`;
    }

    // Disable personal license card if user has commercial license
    if (licenseType === "personal" && hasCommercialLicense) {
      return `${baseClass} border-muted bg-muted/20 opacity-60`;
    }

    if (licenseType === "commercial") {
      return `${baseClass} border-accent bg-accent/5 hover:border-primary/50`;
    }

    return `${baseClass} hover:border-primary/50`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {isOwned && isUpgrading ? (
                <>
                  <ArrowUp className="inline h-5 w-5 mr-2" />
                  {t("licenseModal.upgradeTitle", { itemName })}
                </>
              ) : isOwned ? (
                <>{t("licenseModal.licenseTitle", { itemName })}</>
              ) : (
                <>{t("licenseModal.chooseTitle", { itemName })}</>
              )}
            </h2>
            {isOwned && currentLicense && (
              <p className="text-sm text-muted-foreground mt-1">
                {t("licenseModal.current")}{" "}
                <span className="capitalize font-semibold">
                  {currentLicense}
                </span>{" "}
                {t("licenseModal.license")}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal License */}
            <Card className={getCardClassName("personal")}>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl font-bold text-primary">
                      {personalCredits.toLocaleString()}{" "}
                      {t("licenseModal.credits")}
                    </div>
                    {currentLicense === "personal" && (
                      <div className="flex items-center gap-1 text-sm text-primary font-semibold">
                        <Check className="h-4 w-4" />
                        {t("licenseModal.active")}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-semibold">
                    {t("licenseModal.personalLicense")}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {t("licenseModal.personal.feature1")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {t("licenseModal.personal.feature2")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {t("licenseModal.personal.feature3")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {t("licenseModal.personal.feature4")}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => onSelectLicense("personal")}
                  disabled={
                    isLoading ||
                    currentLicense === "personal" ||
                    hasCommercialLicense
                  }
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  title={
                    hasCommercialLicense
                      ? t("licenseModal.downgradeNotAllowed")
                      : ""
                  }
                >
                  {isLoading
                    ? t("licenseModal.processing")
                    : getButtonText("personal")}
                </Button>
              </div>
            </Card>

            {/* Commercial License */}
            <Card className={getCardClassName("commercial")}>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl font-bold text-primary">
                      {isOwned && currentLicense === "personal" ? (
                        <>
                          <span className="text-xl">+</span>
                          {creditDifference.toLocaleString()}{" "}
                          {t("licenseModal.credits")}
                        </>
                      ) : (
                        <>
                          {commercialCredits.toLocaleString()}{" "}
                          {t("licenseModal.credits")}
                        </>
                      )}
                    </div>
                    {currentLicense === "commercial" && (
                      <div className="flex items-center gap-1 text-sm text-primary font-semibold">
                        <Check className="h-4 w-4" />
                        {t("licenseModal.active")}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-semibold">
                    {t("licenseModal.commercialLicense")}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {t("licenseModal.commercial.feature1")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {t("licenseModal.commercial.feature2")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {t("licenseModal.commercial.feature3")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {t("licenseModal.commercial.feature4")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {t("licenseModal.commercial.feature5")}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => onSelectLicense("commercial")}
                  disabled={isLoading || currentLicense === "commercial"}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    t("licenseModal.processing")
                  ) : (
                    <>
                      {isUpgrading && <ArrowUp className="h-4 w-4 mr-2" />}
                      {getButtonText("commercial")}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Info Section - Only show for upgrades */}
          {isOwned && isUpgrading && (
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-3">
                <ArrowUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-foreground">
                    <strong>{t("licenseModal.upgradeInfo.title")}</strong>{" "}
                    {t("licenseModal.upgradeInfo.description", {
                      credits: creditDifference.toLocaleString(),
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Downgrade Warning - Show if user has commercial license */}
          {isOwned && hasCommercialLicense && (
            <div className="mt-6 p-4 bg-muted border border-border rounded-lg">
              <div className="flex items-start gap-3">
                <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>{t("licenseModal.noDowngradeTitle")}</strong>{" "}
                    {t("licenseModal.noDowngradeDescription")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t pt-4 mt-6 text-center text-sm text-muted-foreground">
            <p>
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                {t("licenseModal.whatsDifference")}
              </button>
              {!isOwned && (
                <>
                  {" • "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    {t("licenseModal.restore")}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LicenseModal;
