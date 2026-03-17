import { useState, useEffect } from "react";
import { Loader2, ShoppingCart, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TMOProductOption, TMOCartItemProductOption } from "@/types/tmo";

interface ProductOptionsModalProps {
  isOpen: boolean;
  productName: string;
  productPrice: number;
  productImage?: string;
  options: TMOProductOption[];
  onClose: () => void;
  onAddToCart: (productOption: TMOCartItemProductOption) => void;
  isLoading?: boolean;
  isUpgradeMode?: boolean;
}

interface SelectedOptions {
  [optionId: number]: string | number;
}

export default function ProductOptionsModal({
  isOpen,
  productName,
  productPrice,
  productImage,
  options,
  onClose,
  onAddToCart,
  isLoading = false,
  isUpgradeMode = false,
}: ProductOptionsModalProps) {
  const { t } = useLanguage();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [errors, setErrors] = useState<{ [optionId: number]: string }>({});

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedOptions({});
      setErrors({});
    }
  }, [isOpen]);

  // Get required options
  const requiredOptions = options.filter((opt) => opt.is_require);

  // Calculate additional price from selected options
  const calculateAdditionalPrice = (): number => {
    let additional = 0;
    Object.entries(selectedOptions).forEach(([optionId, value]) => {
      const option = options.find((opt) => opt.option_id === parseInt(optionId));
      if (option?.values) {
        const selectedValue = option.values.find(
          (v) => v.option_type_id === value,
        );
        if (selectedValue) {
          if (selectedValue.price_type === "percent") {
            additional += (productPrice * selectedValue.price) / 100;
          } else {
            additional += selectedValue.price;
          }
        }
      } else if (option?.price) {
        if (option.price_type === "percent") {
          additional += (productPrice * option.price) / 100;
        } else {
          additional += option.price;
        }
      }
    });
    return additional;
  };

  const totalPrice = productPrice + calculateAdditionalPrice();

  const handleSelectOption = (optionId: number, value: string | number) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
    if (errors[optionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[optionId];
        return next;
      });
    }
  };

  const validateAndSubmit = () => {
    const newErrors: { [optionId: number]: string } = {};
    let hasErrors = false;

    requiredOptions.forEach((option) => {
      if (!selectedOptions[option.option_id]) {
        newErrors[option.option_id] = t("store.selectOption") || "Please select an option";
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Build product option payload
    const customOptions = Object.entries(selectedOptions).map(
      ([optionId, value]) => ({
        option_id: optionId,
        option_value: String(value),
      }),
    );

    const productOption: TMOCartItemProductOption = {
      extension_attributes: {
        custom_options: customOptions,
      },
    };

    onAddToCart(productOption);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isUpgradeMode
              ? t("store.upgradeToCommercial") || "Upgrade to Commercial"
              : t("product.addToCart")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product info */}
          <div className="flex gap-4">
            {productImage && (
              <img
                src={productImage}
                alt={productName}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{productName}</h3>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                ¥{totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Options */}
          {options.length > 0 && (
            <div className="space-y-4">
              {options.map((option) => (
                <div key={option.option_id} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {option.title}
                    {option.is_require && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  {option.values && option.values.length > 0 ? (
                    <div className="grid gap-2">
                      {option.values.map((value) => {
                        const isSelected =
                          selectedOptions[option.option_id] ===
                          value.option_type_id;
                        const priceLabel =
                          value.price > 0
                            ? value.price_type === "percent"
                              ? ` (+${value.price}%)`
                              : ` (+¥${value.price.toFixed(2)})`
                            : "";

                        return (
                          <button
                            key={value.option_type_id}
                            type="button"
                            onClick={() =>
                              handleSelectOption(
                                option.option_id,
                                value.option_type_id,
                              )
                            }
                            className={[
                              "w-full text-left px-4 py-3 rounded-lg border-2 transition-colors",
                              isSelected
                                ? "border-cyan-500 bg-cyan-500/10"
                                : "border-border hover:border-muted-foreground",
                            ].join(" ")}
                          >
                            <span className="font-medium">{value.title}</span>
                            {priceLabel && (
                              <span className="text-muted-foreground text-sm ml-2">
                                {priceLabel}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                      onChange={(e) =>
                        handleSelectOption(option.option_id, e.target.value)
                      }
                    />
                  )}

                  {errors[option.option_id] && (
                    <p className="text-red-500 text-xs">
                      {errors[option.option_id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Submit button */}
          <Button
            onClick={validateAndSubmit}
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isUpgradeMode ? (
              <>
                <ArrowUpCircle className="h-5 w-5 mr-2" />
                {t("store.upgradeToCommercial") || "Upgrade to Commercial"} — ¥
                {totalPrice.toFixed(2)}
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t("product.addToCart")} — ¥{totalPrice.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
