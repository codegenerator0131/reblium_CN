import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, ShoppingCart as ShoppingCartIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

export default function ShoppingCart() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const {
    cartItems,
    loading,
    totals,
    itemsCount,
    removeFromCart,
  } = useCart();

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      toast.success(t("cart.itemRemoved"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove item");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error(t("cart.empty"));
      return;
    }
    navigate("/checkout");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("cart.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("cart.subtitle")}</p>
        </div>

        {loading && cartItems.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        ) : cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingCartIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {t("cart.emptyTitle")}
            </h2>
            <p className="text-muted-foreground mb-6">{t("cart.emptyDesc")}</p>
            <Button
              onClick={() => navigate("/store")}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            >
              {t("cart.continueShopping")}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-muted rounded flex items-center justify-center">
                        <ShoppingCartIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <p className="text-sm text-cyan-400 font-semibold mt-2">
                        ¥{item.price.toFixed(2)}
                      </p>
                      {/* Options */}
                      {item.options && item.options.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {item.options.map((option, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">
                              {option.label}: {option.value}
                            </p>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("cart.quantity")}: {item.qty}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <p className="text-lg font-semibold text-cyan-400">
                        ¥{item.subtotal.toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {t("cart.orderSummary")}
                </h2>
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.items")}:</span>
                    <span className="text-foreground">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.totalQty")}:</span>
                    <span className="text-foreground">{itemsCount}</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  {totals && totals.discount_amount !== 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>{t("cart.discount")}</span>
                      <span>-¥{Math.abs(totals.discount_amount).toFixed(2)}</span>
                    </div>
                  )}
                  {totals && totals.tax_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("cart.tax")}</span>
                      <span className="text-foreground">¥{totals.tax_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span className="text-foreground">{t("cart.total")}</span>
                    <span className="text-cyan-400">
                      ¥{(totals?.grand_total ?? cartItems.reduce((s, i) => s + i.subtotal, 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    t("cart.checkout")
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/store")}
                  className="w-full"
                >
                  {t("cart.continueShopping")}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
