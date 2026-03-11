"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/provider/CartContext";
import { Button } from "@/components/Button";
import { useTranslation } from "react-i18next";

interface CartSidebarProps {
  className?: string;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ className }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    loading,
    totals,
    itemsCount,
    removeFromCart,
  } = useCart();

  const handleRemoveItem = async (itemId: number) => {
    await removeFromCart(itemId);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l shadow-xl z-50 flex flex-col ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{t("cart.title")}</h2>
            {itemsCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {itemsCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && cartItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">{t("cart.empty")}</p>
              <p className="text-sm mt-1">{t("cart.addItemsToStart")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-muted/50 rounded-lg"
                >
                  {/* Product Image */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      SKU: {item.sku}
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      ¥{item.price.toFixed(2)}
                    </p>

                    {/* Options */}
                    {item.options && item.options.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {item.options.map((option, idx) => (
                          <p
                            key={idx}
                            className="text-xs text-muted-foreground"
                          >
                            {option.label}: {option.value}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Remove Button - No quantity controls for digital assets */}
                    <div className="flex items-center justify-end mt-2">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={loading}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs">{t("cart.remove")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Totals */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Subtotal */}
            <div className="space-y-2">
              {(() => {
                const calculatedSubtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
                const displaySubtotal = (totals?.subtotal && totals.subtotal > 0) ? totals.subtotal : calculatedSubtotal;
                const discountAmount = totals?.discount_amount ?? 0;
                const taxAmount = totals?.tax_amount ?? 0;
                const displayTotal = (totals?.grand_total && totals.grand_total > 0)
                  ? totals.grand_total
                  : (calculatedSubtotal - Math.abs(discountAmount) + taxAmount);

                return (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                      <span className="text-foreground">
                        ¥{displaySubtotal.toFixed(2)}
                      </span>
                    </div>
                    {discountAmount !== 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>{t("cart.discount")}</span>
                        <span>-¥{Math.abs(discountAmount).toFixed(2)}</span>
                      </div>
                    )}
                    {taxAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("cart.tax")}</span>
                        <span className="text-foreground">¥{taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span className="text-foreground">{t("cart.total")}</span>
                      <span className="text-primary">
                        ¥{displayTotal.toFixed(2)}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                t("cart.proceedToCheckout")
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
