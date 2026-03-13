import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface LicenseModalProps {
  isOpen: boolean;
  itemName: string;
  personalPriceUSD?: number;
  personalPriceCNY?: number;
  commercialPriceUSD?: number;
  commercialPriceCNY?: number;
  onClose: () => void;
  onSelectLicense: (licenseType: "personal" | "commercial") => void;
  isLoading?: boolean;
}

export default function LicenseModal({
  isOpen,
  itemName,
  personalPriceUSD = 5,
  personalPriceCNY = 36,
  commercialPriceUSD = 25,
  commercialPriceCNY = 180,
  onClose,
  onSelectLicense,
  isLoading = false,
}: LicenseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a License for "{itemName}"</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          {/* Personal License */}
          <Card className="p-6 border-2 hover:border-cyan-500 transition-colors cursor-pointer">
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">${personalPriceUSD} / ¥{personalPriceCNY}</div>
                <p className="text-sm text-muted-foreground font-semibold">Personal License</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">For non-commercial use</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Personal projects only</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">2K textures</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Unlimited exports</span>
                </div>
              </div>

              <Button
                onClick={() => onSelectLicense("personal")}
                disabled={isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              >
                {isLoading ? "Processing..." : "Buy Personal License"}
              </Button>
            </div>
          </Card>

          {/* Commercial License */}
          <Card className="p-6 border-2 border-cyan-500 bg-cyan-500/5">
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">${commercialPriceUSD} / ¥{commercialPriceCNY}</div>
                <p className="text-sm text-muted-foreground font-semibold">Commercial License</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Commercial rights</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">For paid projects</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">4K textures + LODs</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Unlimited exports</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Team use allowed</span>
                </div>
              </div>

              <Button
                onClick={() => onSelectLicense("commercial")}
                disabled={isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              >
                {isLoading ? "Processing..." : "Buy Commercial License"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="border-t pt-4 text-center text-sm text-muted-foreground">
          <p>
            <button className="text-cyan-400 hover:underline">What's the difference?</button>
            {" • "}
            <button className="text-cyan-400 hover:underline">Already purchased? Restore</button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
