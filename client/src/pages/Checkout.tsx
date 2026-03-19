import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Loader2,
  CreditCard,
  MapPin,
  ShoppingBag,
  Check,
  ArrowLeft,
  QrCode,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/_core/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import tmoApi, { ORDER_POLLING_INTERVAL_MS } from "@/lib/tmoApi";
import {
  TMOPaymentMethod,
  TMOAddress,
  TMOCartTotals,
  TMOGeoItem,
} from "@/types/tmo";
import { useLanguage } from "@/contexts/LanguageContext";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BillingFormData {
  street: string;
  postcode: string;
}

interface BillingFormErrors {
  street?: string;
  city?: string;
  postcode?: string;
}

export default function Checkout() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { user: tmoUser, isAuthenticated } = useAuth();
  const {
    cartItems,
    totals,
    refreshCart,
    clearCart,
    cartId,
    proceedToCheckout,
  } = useCart();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<TMOPaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [step, setStep] = useState<"review" | "billing" | "payment" | "complete">("review");
  const [orderId, setOrderId] = useState<string | null>(null);

  const [billingForm, setBillingForm] = useState<BillingFormData>({
    street: "",
    postcode: "",
  });
  const [billingErrors, setBillingErrors] = useState<BillingFormErrors>({});
  const [checkoutTotals, setCheckoutTotals] = useState<TMOCartTotals | null>(null);

  // Geo data for China (from API)
  const [geoRegions, setGeoRegions] = useState<TMOGeoItem[]>([]);
  const [geoCities, setGeoCities] = useState<TMOGeoItem[]>([]);
  const [geoDistricts, setGeoDistricts] = useState<TMOGeoItem[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // WeChat payment state
  const [wechatPaymentUrl, setWechatPaymentUrl] = useState<string | null>(null);
  const [isPollingPayment, setIsPollingPayment] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingOrderIdRef = useRef<string | null>(null);

  // Customer addresses state
  const [customerAddresses, setCustomerAddresses] = useState<TMOAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(false);

  // Stop polling function
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPollingPayment(false);
    pollingOrderIdRef.current = null;
  }, []);

  // Poll order status for WeChat payment
  const startPollingOrderStatus = useCallback(
    (orderIdToPoll: string) => {
      setIsPollingPayment(true);
      pollingOrderIdRef.current = orderIdToPoll;

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const token = tmoApi.getTMOToken();
          if (!token || !pollingOrderIdRef.current) {
            stopPolling();
            return;
          }

          const orderDetail = await tmoApi.getOrderDetail(
            parseInt(pollingOrderIdRef.current),
            token,
          );

          const status = orderDetail.status?.toLowerCase();
          const state = orderDetail.state?.toLowerCase();

          if (tmoApi.isOrderSuccess(status || "") || tmoApi.isOrderSuccess(state || "")) {
            stopPolling();
            setWechatPaymentUrl(null);
            clearCart();
            setStep("complete");
            toast.success(t("checkout.paymentCompleted"));
          }

          if (tmoApi.isOrderFailed(status || "")) {
            stopPolling();
            setWechatPaymentUrl(null);
            toast.error(t("checkout.orderFailed"));
            setStep("billing");
          }
        } catch (error) {
          console.error("Error polling order status:", error);
        }
      }, ORDER_POLLING_INTERVAL_MS);
    },
    [clearCart, stopPolling, t],
  );

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Load geo regions on mount
  useEffect(() => {
    const loadRegions = async () => {
      setLoadingRegions(true);
      try {
        const regions = await tmoApi.getRegions();
        setGeoRegions(regions);
      } catch (error) {
        console.error("Failed to load regions:", error);
      } finally {
        setLoadingRegions(false);
      }
    };
    loadRegions();
  }, []);

  const loadCities = async (regionId: string) => {
    setLoadingCities(true);
    setGeoCities([]);
    setGeoDistricts([]);
    setSelectedCity("");
    setSelectedDistrict("");
    try {
      const cities = await tmoApi.getCities(regionId);
      setGeoCities(cities);
    } catch (error) {
      console.error("Failed to load cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  const loadDistricts = async (cityId: string) => {
    setLoadingDistricts(true);
    setGeoDistricts([]);
    setSelectedDistrict("");
    try {
      const districts = await tmoApi.getDistricts(cityId);
      setGeoDistricts(districts);
    } catch (error) {
      console.error("Failed to load districts:", error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    if (regionId) {
      loadCities(regionId);
    } else {
      setGeoCities([]);
      setGeoDistricts([]);
    }
    if (billingErrors.city) {
      setBillingErrors((prev) => ({ ...prev, city: undefined }));
    }
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    if (cityId) {
      loadDistricts(cityId);
    } else {
      setGeoDistricts([]);
    }
    if (billingErrors.city) {
      setBillingErrors((prev) => ({ ...prev, city: undefined }));
    }
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Load cart and payment methods
  useEffect(() => {
    const loadCheckoutData = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        await refreshCart();

        const token = tmoApi.getTMOToken();
        if (token) {
          const methods = await tmoApi.getPaymentMethods(token);
          setPaymentMethods(methods);
          if (methods.length > 0) {
            setSelectedPaymentMethod(methods[0].code);
          }

          try {
            const addresses = await tmoApi.getAddress(token);
            setCustomerAddresses(addresses || []);

            const defaultBillingAddr = addresses?.find((a) => a.default_billing);
            if (defaultBillingAddr?.id) {
              setSelectedAddressId(defaultBillingAddr.id);
            } else if (addresses && addresses.length > 0) {
              setSelectedAddressId(addresses[0].id || null);
            } else {
              setShowNewAddressForm(true);
            }
          } catch (addrError) {
            console.warn("Could not fetch addresses:", addrError);
            setShowNewAddressForm(true);
          }
        }
      } catch (error) {
        console.error("Error loading checkout data:", error);
        toast.error(t("checkout.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [isAuthenticated, refreshCart, tmoUser]);

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setBillingForm((prev) => ({ ...prev, [name]: value }));

    if (billingErrors[name as keyof BillingFormErrors]) {
      setBillingErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddressSelect = (addressId: number | null) => {
    setSelectedAddressId(addressId);
    if (addressId === null) {
      setShowNewAddressForm(true);
      setBillingForm({ street: "", postcode: "" });
      setSelectedRegion("");
      setSelectedCity("");
      setSelectedDistrict("");
      setGeoCities([]);
      setGeoDistricts([]);
    } else {
      setShowNewAddressForm(false);
    }
  };

  const validateBillingForm = (): boolean => {
    const errors: BillingFormErrors = {};
    let isValid = true;

    if (showNewAddressForm || customerAddresses.length === 0) {
      if (!billingForm.street) {
        errors.street = t("checkout.fieldRequired");
        isValid = false;
      }
      if (!selectedCity) {
        errors.city = t("checkout.fieldRequired");
        isValid = false;
      }
      if (!billingForm.postcode) {
        errors.postcode = t("checkout.fieldRequired");
        isValid = false;
      }
    }

    setBillingErrors(errors);

    if (!isValid) {
      toast.error(t("checkout.fillRequiredFields"));
    }

    return isValid;
  };

  const handlePlaceOrder = async () => {
    if (!validateBillingForm()) return;
    if (!selectedPaymentMethod) {
      toast.error(t("checkout.selectPaymentMethod"));
      return;
    }

    setSubmitting(true);
    try {
      const token = tmoApi.getTMOToken();
      if (!token) throw new Error("Not authenticated");
      if (!cartId) throw new Error("No cart found");

      let billingAddress: any;

      if (!showNewAddressForm && selectedAddressId) {
        const savedAddr = customerAddresses.find((a) => a.id === selectedAddressId);
        if (!savedAddr) throw new Error("Selected address not found");

        const regionName =
          typeof savedAddr.region === "object" && savedAddr.region !== null
            ? (savedAddr.region as any).region || ""
            : savedAddr.region || "";

        billingAddress = {
          firstname: savedAddr.firstname,
          lastname: savedAddr.lastname,
          street: savedAddr.street,
          city: savedAddr.city,
          postcode: savedAddr.postcode,
          country_id: savedAddr.country_id || "CN",
          telephone: savedAddr.telephone,
          region_id: savedAddr.region_id,
          region: regionName,
        };
      } else {
        const selectedCityData = geoCities.find((c) => c.id === selectedCity);
        const selectedDistrictData = geoDistricts.find((d) => d.id === selectedDistrict);
        const selectedRegionData = geoRegions.find((r) => r.id === selectedRegion);

        let cityValue = selectedCityData?.name || "";
        if (selectedDistrictData?.name) {
          cityValue = `${cityValue} ${selectedDistrictData.name}`;
        }

        billingAddress = {
          firstname: tmoUser?.firstname || "",
          lastname: tmoUser?.lastname || "",
          street: [billingForm.street],
          city: cityValue,
          postcode: billingForm.postcode,
          country_id: "CN",
          telephone: tmoUser?.mobile || "",
        };

        if (selectedRegion && selectedRegionData) {
          billingAddress.region_id = parseInt(selectedRegionData.id, 10);
          billingAddress.region = selectedRegionData.name;
        }
      }

      // Ensure items are moved to checkout cart
      if (cartItems.length > 0 && !checkoutTotals) {
        const itemIds = cartItems.map((item) => item.id);
        await proceedToCheckout(itemIds);
      }

      // Save address for future if checkbox is checked and using new address
      if (saveAddressForFuture && showNewAddressForm && selectedDistrict) {
        try {
          const addressPayload = {
            address: {
              firstname: tmoUser?.firstname || "",
              lastname: tmoUser?.lastname || "",
              postcode: billingForm.postcode,
              street: [billingForm.street],
              telephone: tmoUser?.mobile || "",
              custom_attributes: [
                { attribute_code: "district_id", value: parseInt(selectedDistrict, 10) },
                { attribute_code: "mobile_prefix", value: "+86" },
                { attribute_code: "mobile", value: tmoUser?.mobile || "" },
              ],
            },
            default_billing: customerAddresses.length === 0,
          };
          await tmoApi.createAddress(addressPayload, token);
        } catch (addrError) {
          console.warn("Could not save address for future:", addrError);
        }
      }

      const newOrderId = await tmoApi.placeOrder(
        selectedPaymentMethod,
        billingAddress,
        billingAddress,
        token,
      );

      setOrderId(newOrderId.toString());

      const paymentMethodLower = selectedPaymentMethod.toLowerCase();
      const isAlipay = paymentMethodLower.includes("alipay");
      const isWeChat = paymentMethodLower.includes("wechat");

      if (isAlipay || isWeChat) {
        try {
          const paymentData = isAlipay
            ? await tmoApi.getAlipayQRCode(newOrderId.toString())
            : await tmoApi.getWeChatQRCode(newOrderId.toString());

          const paymentUrl = paymentData?.qr_code;

          if (paymentUrl && paymentUrl.trim() !== "") {
            setStep("payment");

            localStorage.setItem("pending_order_id", newOrderId.toString());
            localStorage.setItem("pending_payment_url", paymentUrl);
            localStorage.setItem("pending_payment_method", selectedPaymentMethod);

            if (isWeChat) {
              setWechatPaymentUrl(paymentUrl);
              startPollingOrderStatus(newOrderId.toString());
            } else {
              setTimeout(() => {
                window.location.href = paymentUrl;
              }, 1000);
            }
          } else {
            console.error("No payment URL received");
            toast.error("Payment URL not available");
            setStep("complete");
            clearCart();
          }
        } catch (err) {
          console.error(`Error getting payment URL:`, err);
          toast.error(
            `Failed to get payment URL: ${err instanceof Error ? err.message : "Unknown error"}`,
          );
          setStep("complete");
          clearCart();
        }
      } else {
        setStep("complete");
        clearCart();
        toast.success(t("checkout.orderPlaced"));
      }
    } catch (error) {
      console.error("Error placing order:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("checkout.orderFailed");
      toast.error(errorMessage);
      setStep("billing");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle moving to billing step
  const handleContinueToBilling = async () => {
    if (cartItems.length === 0) {
      toast.error(t("checkout.cartEmpty"));
      return;
    }

    setLoading(true);
    try {
      const token = tmoApi.getTMOToken();
      if (!token || !cartId) {
        toast.error(t("checkout.notAuthenticated"));
        return;
      }

      const itemIds = cartItems.map((item) => item.id);
      await proceedToCheckout(itemIds);

      try {
        const updatedTotals = await tmoApi.getTotals(token);
        setCheckoutTotals(updatedTotals);
      } catch (totalsError) {
        console.warn("Could not fetch checkout totals:", totalsError);
      }

      setStep("billing");
    } catch (error) {
      console.error("Error preparing checkout:", error);
      toast.error(
        error instanceof Error ? error.message : t("checkout.checkoutPrepareFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateCartSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const activeTotals = checkoutTotals || totals;
  const cartSubtotal = calculateCartSubtotal();
  const displaySubtotal =
    activeTotals?.subtotal && activeTotals.subtotal > 0
      ? activeTotals.subtotal
      : cartSubtotal;
  const displayShipping = activeTotals?.shipping_amount ?? 0;
  const displayDiscount = activeTotals?.discount_amount ?? 0;
  const displayTax = activeTotals?.tax_amount ?? 0;
  const displayGrandTotal =
    activeTotals?.grand_total && activeTotals.grand_total > 0
      ? activeTotals.grand_total
      : cartSubtotal - Math.abs(displayDiscount) + displayTax + displayShipping;

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (cartItems.length === 0 && step !== "complete") {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/store")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>{t("checkout.backToStore")}</span>
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ShoppingBag className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">{t("checkout.cartEmpty")}</p>
            <p className="text-sm mt-1">{t("checkout.addItemsToCheckout")}</p>
            <Button
              className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-black"
              onClick={() => navigate("/store")}
            >
              {t("checkout.browseStore")}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (step === "billing") setStep("review");
              else if (step === "payment") setStep("billing");
              else navigate("/store");
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>{t("checkout.back")}</span>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {t("checkout.title")}
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4">
          {(["review", "billing", "payment", "complete"] as const).map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center gap-2 ${
                  step === s
                    ? "text-cyan-500"
                    : ["review", "billing", "payment", "complete"].indexOf(step) > i
                      ? "text-green-600"
                      : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === s
                      ? "border-cyan-500 bg-cyan-500 text-black"
                      : ["review", "billing", "payment", "complete"].indexOf(step) > i
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-muted-foreground"
                  }`}
                >
                  {["review", "billing", "payment", "complete"].indexOf(step) > i ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className="text-sm font-medium capitalize hidden sm:inline">
                  {t(`checkout.steps.${s}`)}
                </span>
              </div>
              {i < 3 && (
                <div className="w-8 sm:w-16 h-0.5 bg-muted-foreground/30" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Review */}
        {step === "review" && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                {t("checkout.orderSummary")}
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 py-3 border-b last:border-b-0">
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("cart.quantity")}: {item.qty} x ¥{item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      ¥{item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("checkout.itemsSubtotal")}</span>
                  <span className="text-foreground font-medium">
                    ¥{calculateCartSubtotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {t("checkout.orderTotal")}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
                  <span className="text-foreground">¥{displaySubtotal.toFixed(2)}</span>
                </div>
                {displayShipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.shipping")}</span>
                    <span className="text-foreground">¥{displayShipping.toFixed(2)}</span>
                  </div>
                )}
                {displayDiscount < 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("checkout.discount")}</span>
                    <span>-¥{Math.abs(displayDiscount).toFixed(2)}</span>
                  </div>
                )}
                {displayTax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.tax")}</span>
                    <span className="text-foreground">¥{displayTax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t font-bold text-lg">
                  <span className="text-foreground">{t("checkout.total")}</span>
                  <span className="text-cyan-500">¥{displayGrandTotal.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                size="lg"
                onClick={handleContinueToBilling}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  t("checkout.continueToBilling")
                )}
              </Button>
            </Card>
          </div>
        )}

        {/* Step 2: Billing */}
        {step === "billing" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Billing Form */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("checkout.billingAddress")}
              </h2>

              {/* Saved Addresses Selection */}
              {customerAddresses.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-3">
                    {t("checkout.selectAddress")}
                  </p>
                  <div className="space-y-2">
                    {customerAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddressId === addr.id && !showNewAddressForm
                            ? "border-cyan-500 bg-cyan-500/5"
                            : "hover:border-muted-foreground/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="saved_address"
                          checked={selectedAddressId === addr.id && !showNewAddressForm}
                          onChange={() => handleAddressSelect(addr.id || null)}
                          className="mt-1 w-4 h-4 text-cyan-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">
                            {addr.firstname} {addr.lastname}
                            {addr.default_billing && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-cyan-500/10 text-cyan-500 rounded-full">
                                {t("checkout.savedAddresses")}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {addr.street?.join(", ")}, {addr.city}
                            {addr.postcode && ` ${addr.postcode}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{addr.telephone}</p>
                        </div>
                      </label>
                    ))}
                    <label
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        showNewAddressForm
                          ? "border-cyan-500 bg-cyan-500/5"
                          : "hover:border-muted-foreground/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="saved_address"
                        checked={showNewAddressForm}
                        onChange={() => handleAddressSelect(null)}
                        className="w-4 h-4 text-cyan-500"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {t("checkout.useNewAddress")}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* New Address Form */}
              {(showNewAddressForm || customerAddresses.length === 0) && (
                <div className="space-y-4">
                  {/* Name and Phone - Read only from user profile */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t("checkout.firstName")}
                      </label>
                      <input
                        type="text"
                        value={tmoUser?.firstname || ""}
                        disabled
                        className="w-full px-3 py-2 border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t("checkout.lastName")}
                      </label>
                      <input
                        type="text"
                        value={tmoUser?.lastname || ""}
                        disabled
                        className="w-full px-3 py-2 border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("checkout.phoneNumber")}
                    </label>
                    <div className="flex gap-2">
                      <span className="px-3 py-2 border rounded-md bg-muted text-muted-foreground text-sm">
                        {tmoUser?.mobile_prefix || "+86"}
                      </span>
                      <input
                        type="tel"
                        value={tmoUser?.mobile || ""}
                        disabled
                        className="flex-1 px-3 py-2 border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("checkout.streetAddress")} *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={billingForm.street}
                      onChange={handleBillingChange}
                      className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                        billingErrors.street ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {billingErrors.street && (
                      <p className="text-red-500 text-xs mt-1">{billingErrors.street}</p>
                    )}
                  </div>
                  {/* Region -> City -> District cascading selects */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t("checkout.region")} *
                      </label>
                      <select
                        value={selectedRegion}
                        onChange={(e) => handleRegionChange(e.target.value)}
                        disabled={loadingRegions}
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                      >
                        <option value="">
                          {loadingRegions ? "Loading..." : t("checkout.selectRegion")}
                        </option>
                        {geoRegions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t("checkout.city")} *
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => handleCityChange(e.target.value)}
                        disabled={loadingCities || geoCities.length === 0}
                        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 ${
                          billingErrors.city ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">
                          {loadingCities ? "Loading..." : t("checkout.selectCity")}
                        </option>
                        {geoCities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {billingErrors.city && (
                        <p className="text-red-500 text-xs mt-1">{billingErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t("checkout.district")}
                      </label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        disabled={loadingDistricts || geoDistricts.length === 0}
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                      >
                        <option value="">
                          {loadingDistricts ? "Loading..." : t("checkout.selectDistrict")}
                        </option>
                        {geoDistricts.map((district) => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t("checkout.postalCode")} *
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={billingForm.postcode}
                      onChange={handleBillingChange}
                      className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                        billingErrors.postcode ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {billingErrors.postcode && (
                      <p className="text-red-500 text-xs mt-1">{billingErrors.postcode}</p>
                    )}
                  </div>
                  {/* Save for future checkbox */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="saveAddressForFuture"
                      checked={saveAddressForFuture}
                      onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                      className="w-4 h-4 text-cyan-500 rounded border-gray-300 focus:ring-cyan-500"
                    />
                    <label htmlFor="saveAddressForFuture" className="text-sm text-foreground">
                      {t("checkout.saveForFuture")}
                    </label>
                  </div>
                </div>
              )}
            </Card>

            {/* Payment Method Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t("checkout.paymentMethod")}
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.code}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.code
                        ? "border-cyan-500 bg-cyan-500/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.code}
                      checked={selectedPaymentMethod === method.code}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-cyan-500"
                    />
                    <span className="font-medium text-foreground">{method.title}</span>
                  </label>
                ))}
                {paymentMethods.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    {t("checkout.noPaymentMethods")}
                  </p>
                )}
              </div>

              {/* Order Summary Mini */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
                  <span className="text-foreground">¥{displaySubtotal.toFixed(2)}</span>
                </div>
                {displayShipping > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("checkout.shipping")}</span>
                    <span className="text-foreground">¥{displayShipping.toFixed(2)}</span>
                  </div>
                )}
                {displayDiscount < 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{t("checkout.discount")}</span>
                    <span>-¥{Math.abs(displayDiscount).toFixed(2)}</span>
                  </div>
                )}
                {displayTax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("checkout.tax")}</span>
                    <span className="text-foreground">¥{displayTax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span className="text-foreground">{t("checkout.total")}</span>
                  <span className="text-cyan-500">¥{displayGrandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={submitting || !selectedPaymentMethod}
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  `${t("checkout.placeOrder")} - ¥${displayGrandTotal.toFixed(2)}`
                )}
              </Button>
            </Card>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === "payment" && (
          <Card className="p-6 max-w-md mx-auto text-center">
            {wechatPaymentUrl ? (
              <>
                <div className="mb-4">
                  <QrCode className="h-12 w-12 mx-auto text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {t("checkout.wechat.scanToPay")}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {t("checkout.wechat.completeInApp")}
                </p>

                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(wechatPaymentUrl)}`}
                    alt="WeChat Payment QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                {orderId && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("checkout.alipay.order")}:{" "}
                    <span className="font-mono">{orderId}</span>
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  {isPollingPayment ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{t("checkout.wechat.waitingForPayment")}</span>
                    </>
                  ) : (
                    <span>{t("checkout.wechat.completeInApp")}</span>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    stopPolling();
                    setWechatPaymentUrl(null);
                    setStep("billing");
                  }}
                  className="mt-2"
                >
                  {t("checkout.back")}
                </Button>
              </>
            ) : (
              <>
                <Loader2 className="h-12 w-12 mx-auto mb-4 text-cyan-500 animate-spin" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {t("checkout.redirecting")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("checkout.redirectingToAlipay")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("checkout.pleaseWait")}
                </p>
              </>
            )}
          </Card>
        )}

        {/* Step 4: Complete */}
        {step === "complete" && (
          <Card className="p-6 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t("checkout.complete.title")}
            </h2>
            <p className="text-muted-foreground mb-2">
              {t("checkout.complete.thankYou")}
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground mb-6">
                {t("checkout.complete.orderNumber")}:{" "}
                <span className="font-mono text-foreground">{orderId}</span>
              </p>
            )}
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/store")}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              >
                {t("checkout.complete.continueShopping")}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
