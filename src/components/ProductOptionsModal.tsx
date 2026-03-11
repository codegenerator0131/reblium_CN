"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, ShoppingCart, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { TMOProductOption, TMOCartItemProductOption } from "@/types/tmo";
import { useTranslation } from "react-i18next";

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

const ProductOptionsModal: React.FC<ProductOptionsModalProps> = ({
  isOpen,
  productName,
  productPrice,
  productImage,
  options,
  onClose,
  onAddToCart,
  isLoading = false,
  isUpgradeMode = false,
}) => {
  const { t } = useTranslation("common");
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [errors, setErrors] = useState<{ [optionId: number]: string }>({});

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedOptions({});
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Get required options
  const requiredOptions = options.filter((opt) => opt.is_require);

  // Calculate additional price from selected options
  const calculateAdditionalPrice = (): number => {
    let additional = 0;
    Object.entries(selectedOptions).forEach(([optionId, value]) => {
      const option = options.find((opt) => opt.option_id === parseInt(optionId));
      if (option?.values) {
        const selectedValue = option.values.find(
          (v) => v.option_type_id === value
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

  const handleOptionChange = (optionId: number, value: string | number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
    // Clear error when option is selected
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[optionId];
      return newErrors;
    });
  };

  const validateAndSubmit = () => {
    const newErrors: { [optionId: number]: string } = {};

    // Check all required options are selected
    requiredOptions.forEach((option) => {
      if (!selectedOptions[option.option_id]) {
        newErrors[option.option_id] = t("productOptions.pleaseSelect", { option: option.title });
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build product option for cart
    const customOptions = Object.entries(selectedOptions).map(
      ([optionId, value]) => ({
        option_id: optionId,
        option_value: String(value),
      })
    );

    const productOption: TMOCartItemProductOption = {
      extension_attributes: {
        custom_options: customOptions,
      },
    };

    onAddToCart(productOption);
  };

  const renderOptionInput = (option: TMOProductOption) => {
    const hasError = !!errors[option.option_id];

    switch (option.type) {
      case "drop_down":
      case "select":
        return (
          <div key={option.option_id} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {option.title}
              {option.is_require && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <select
              value={selectedOptions[option.option_id] || ""}
              onChange={(e) =>
                handleOptionChange(option.option_id, parseInt(e.target.value))
              }
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                hasError ? "border-destructive" : "border-input"
              }`}
            >
              <option value="">{t("productOptions.selectOption", { option: option.title })}</option>
              {option.values?.map((value) => (
                <option key={value.option_type_id} value={value.option_type_id}>
                  {value.title}
                  {value.price > 0 && (
                    <> (+¥{value.price.toFixed(2)})</>
                  )}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="text-sm text-destructive">{errors[option.option_id]}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={option.option_id} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {option.title}
              {option.is_require && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <div className="space-y-2">
              {option.values?.map((value) => (
                <label
                  key={value.option_type_id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`option-${option.option_id}`}
                    checked={
                      selectedOptions[option.option_id] === value.option_type_id
                    }
                    onChange={() =>
                      handleOptionChange(option.option_id, value.option_type_id)
                    }
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">
                    {value.title}
                    {value.price > 0 && (
                      <span className="text-muted-foreground ml-2">
                        (+¥{value.price.toFixed(2)})
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
            {hasError && (
              <p className="text-sm text-destructive">{errors[option.option_id]}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={option.option_id} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {option.title}
              {option.is_require && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <div className="space-y-2">
              {option.values?.map((value) => (
                <label
                  key={value.option_type_id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedOptions[option.option_id] === value.option_type_id
                    }
                    onChange={(e) =>
                      handleOptionChange(
                        option.option_id,
                        e.target.checked ? value.option_type_id : 0
                      )
                    }
                    className="w-4 h-4 text-primary focus:ring-primary rounded"
                  />
                  <span className="text-sm text-foreground">
                    {value.title}
                    {value.price > 0 && (
                      <span className="text-muted-foreground ml-2">
                        (+¥{value.price.toFixed(2)})
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
            {hasError && (
              <p className="text-sm text-destructive">{errors[option.option_id]}</p>
            )}
          </div>
        );

      case "field":
      case "area":
        return (
          <div key={option.option_id} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {option.title}
              {option.is_require && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            {option.type === "area" ? (
              <textarea
                value={selectedOptions[option.option_id] || ""}
                onChange={(e) =>
                  handleOptionChange(option.option_id, e.target.value)
                }
                maxLength={option.max_characters || undefined}
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] ${
                  hasError ? "border-destructive" : "border-input"
                }`}
                placeholder={`Enter ${option.title}`}
              />
            ) : (
              <input
                type="text"
                value={selectedOptions[option.option_id] || ""}
                onChange={(e) =>
                  handleOptionChange(option.option_id, e.target.value)
                }
                maxLength={option.max_characters || undefined}
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  hasError ? "border-destructive" : "border-input"
                }`}
                placeholder={`Enter ${option.title}`}
              />
            )}
            {option.max_characters && (
              <p className="text-xs text-muted-foreground">
                {t("productOptions.maxCharacters", { max: option.max_characters })}
              </p>
            )}
            {hasError && (
              <p className="text-sm text-destructive">{errors[option.option_id]}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex items-start justify-between">
          <div className="flex gap-4">
            {productImage && (
              <img
                src={productImage}
                alt={productName}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              {isUpgradeMode && (
                <p className="text-xs text-blue-500 font-medium mb-1">
                  {t("productOptions.upgradeLicense")}
                </p>
              )}
              <h2 className="text-lg font-semibold text-foreground">
                {productName}
              </h2>
              <p className="text-lg font-bold text-primary mt-1">
                ¥{totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 overflow-y-auto max-h-[50vh] space-y-4">
          {options.length > 0 ? (
            options.map(renderOptionInput)
          ) : (
            <p className="text-muted-foreground text-center py-4">
              {t("productOptions.noOptions")}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            onClick={validateAndSubmit}
            disabled={isLoading}
            className={`w-full ${isUpgradeMode ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""}`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : isUpgradeMode ? (
              <ArrowUpCircle className="h-4 w-4 mr-2" />
            ) : (
              <ShoppingCart className="h-4 w-4 mr-2" />
            )}
            {isUpgradeMode
              ? `${t("productOptions.upgradeToCommercial")} - ¥${totalPrice.toFixed(2)}`
              : `${t("productOptions.addToCart")} - ¥${totalPrice.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductOptionsModal;
