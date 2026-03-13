import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Trash2, ShoppingCart as ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ShoppingCart() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const cartQuery = trpc.cart.getItems.useQuery();
  const removeItemMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      cartQuery.refetch();
      toast.success(t('cart.itemRemoved'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateQuantityMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => {
      cartQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const clearCartMutation = trpc.cart.clear.useMutation({
    onSuccess: async () => {
      await cartQuery.refetch();
      toast.success(t('cart.cleared'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const cartItems = cartQuery.data || [];

  const calculateTotal = (currency = "USD") => {
    return cartItems.reduce((total, item) => {
      let price = 0;
      if (currency === "USD") {
        price = item.licenseType === "personal"
          ? parseFloat(item.item?.personalPriceUSD?.toString() || "0")
          : parseFloat(item.item?.commercialPriceUSD?.toString() || "0");
      } else {
        price = item.licenseType === "personal"
          ? parseFloat(item.item?.personalPriceCNY?.toString() || "0")
          : parseFloat(item.item?.commercialPriceCNY?.toString() || "0");
      }
      return total + price * item.quantity;
    }, 0);
  };

  const handleQuantityChange = (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error(t('cart.empty'));
      return;
    }
    toast.success(t('common.featureSoon'));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('cart.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('cart.subtitle')}</p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingCartIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('cart.emptyTitle')}</h2>
            <p className="text-muted-foreground mb-6">{t('cart.emptyDesc')}</p>
            <Button
              onClick={() => navigate("/store")}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            >
              {t('cart.continueShopping')}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    {item.item?.thumbnailUrl && (
                      <img
                        src={item.item.thumbnailUrl}
                        alt={item.item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {(language === 'zh' && item.item?.nameCn ? item.item.nameCn : item.item?.name) || t('cart.unknownItem')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t('cart.license')}: {item.licenseType === "personal" ? t('store.personal') : t('store.commercial')}
                      </p>
                      <p className="text-sm text-cyan-400 font-semibold mt-2">
                        ${item.licenseType === "personal"
                          ? item.item?.personalPriceUSD
                          : item.item?.commercialPriceUSD}{" / "}
                        ¥{item.licenseType === "personal"
                          ? item.item?.personalPriceCNY
                          : item.item?.commercialPriceCNY}{" "}
                        {t('cart.perItem')}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-muted-foreground">{t('cart.quantity')}:</span>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value))
                          }
                          className="w-16"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <p className="text-lg font-semibold text-cyan-400">
                        ${(parseFloat((item.licenseType === "personal"
                          ? item.item?.personalPriceUSD || "0"
                          : item.item?.commercialPriceUSD || "0").toString()) * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItemMutation.mutate({ cartItemId: item.id })}
                        disabled={removeItemMutation.isPending}
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
                <h2 className="text-lg font-semibold text-foreground">{t('cart.orderSummary')}</h2>
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('cart.items')}:</span>
                    <span className="text-foreground">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('cart.totalQty')}:</span>
                    <span className="text-foreground">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('cart.totalUSD')}:</span>
                    <span className="text-cyan-400 font-semibold">${calculateTotal("USD").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('cart.totalCNY')}:</span>
                    <span className="text-cyan-400 font-semibold">¥{calculateTotal("CNY").toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                >
                  {t('cart.checkout')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/store")}
                  className="w-full"
                >
                  {t('cart.continueShopping')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => clearCartMutation.mutate()}
                  disabled={clearCartMutation.isPending}
                  className="w-full text-red-500 hover:text-red-600"
                >
                  {t('cart.clearCart')}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
