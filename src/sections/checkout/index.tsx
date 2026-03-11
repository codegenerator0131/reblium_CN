"use client";

import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
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

import { UserContext } from "@/provider/UserContext";
import { useCart } from "@/provider/CartContext";
import tmoApi from "@/lib/tmoApi";
import { isOrderSuccess, isOrderFailed, ORDER_POLLING_INTERVAL_MS } from "@/Constant";
import { TMOPaymentMethod, TMOAddress, TMOCartTotals, TMOGeoItem } from "@/types/tmo";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

interface BillingFormData {
  street: string;
  postcode: string;
}

interface BillingFormErrors {
  street?: string;
  city?: string;
  postcode?: string;
}

const CheckoutView: React.FC = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tmoUser, isAuthenticated } = useContext(UserContext);
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [step, setStep] = useState<
    "review" | "billing" | "payment" | "complete"
  >("review");
  const [orderId, setOrderId] = useState<string | null>(null);

  const [billingForm, setBillingForm] = useState<BillingFormData>({
    street: "",
    postcode: "",
  });

  const [billingErrors, setBillingErrors] = useState<BillingFormErrors>({});
  const [checkoutTotals, setCheckoutTotals] = useState<TMOCartTotals | null>(
    null,
  );

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

      // Poll every 3 seconds
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

          // Check if payment is complete based on status and state
          const status = orderDetail.status?.toLowerCase();
          const state = orderDetail.state?.toLowerCase();

          // Payment successful statuses
          if (isOrderSuccess(status || "") || isOrderSuccess(state || "")) {
            stopPolling();
            setWechatPaymentUrl(null);
            clearCart();
            setStep("complete");
            toast.success(t("checkout.paymentCompleted"));
          }

          // Payment failed statuses
          if (isOrderFailed(status || "")) {
            stopPolling();
            setWechatPaymentUrl(null);
            toast.error(t("checkout.orderFailed"));
            setStep("billing");
          }
        } catch (error) {
          console.error("Error polling order status:", error);
          // Don't stop polling on transient errors, just log them
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
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Load cart and payment methods
  useEffect(() => {
    const loadCheckoutData = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        await refreshCart();

        const token = tmoApi.getTMOToken();
        if (token) {
          // Fetch payment methods
          const methods = await tmoApi.getPaymentMethods(token);
          setPaymentMethods(methods);
          if (methods.length > 0) {
            setSelectedPaymentMethod(methods[0].code);
          }

          // Fetch customer addresses
          try {
            const addresses = await tmoApi.getAddress(token);
            setCustomerAddresses(addresses || []);

            // Find and pre-select default billing address
            const defaultBillingAddr = addresses?.find((a) => a.default_billing);
            if (defaultBillingAddr?.id) {
              setSelectedAddressId(defaultBillingAddr.id);
              // Using saved address - no need to populate form
            } else if (addresses && addresses.length > 0) {
              // Use first address if no default
              const firstAddr = addresses[0];
              setSelectedAddressId(firstAddr.id || null);
              // Using saved address - no need to populate form
            } else {
              // No saved addresses, show new address form
              setShowNewAddressForm(true);
            }
          } catch (addrError) {
            console.warn("Could not fetch addresses:", addrError);
            // No saved addresses - show new address form
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

    // Clear error when user starts typing
    if (billingErrors[name as keyof BillingFormErrors]) {
      setBillingErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddressSelect = (addressId: number | null) => {
    setSelectedAddressId(addressId);
    if (addressId === null) {
      // User wants to enter a new address
      setShowNewAddressForm(true);
      setBillingForm({
        street: "",
        postcode: "",
      });
      // Reset geo selections
      setSelectedRegion("");
      setSelectedCity("");
      setSelectedDistrict("");
      setGeoCities([]);
      setGeoDistricts([]);
    } else {
      setShowNewAddressForm(false);
      // No need to populate form - we'll use saved address directly
    }
  };

  const validateBillingForm = (): boolean => {
    const errors: BillingFormErrors = {};
    let isValid = true;

    // Only validate address fields for new address (name/phone come from user profile)
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

      // Check if using a saved address or new address
      if (!showNewAddressForm && selectedAddressId) {
        // Using saved address - use it directly
        const savedAddr = customerAddresses.find((a) => a.id === selectedAddressId);
        if (!savedAddr) throw new Error("Selected address not found");

        // Extract region name if region is an object
        const regionName = typeof savedAddr.region === 'object' && savedAddr.region !== null
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
        // Using new address - build from geo selections
        const selectedCityData = geoCities.find((c) => c.id === selectedCity);
        const selectedDistrictData = geoDistricts.find((d) => d.id === selectedDistrict);
        const selectedRegionData = geoRegions.find((r) => r.id === selectedRegion);

        let cityValue = selectedCityData?.name || "";
        if (selectedDistrictData?.name) {
          cityValue = `${cityValue} ${selectedDistrictData.name}`;
        }

        // Use user profile data for name and phone
        billingAddress = {
          firstname: tmoUser?.firstname || "",
          lastname: tmoUser?.lastname || "",
          street: [billingForm.street],
          city: cityValue,
          postcode: billingForm.postcode,
          country_id: "CN",
          telephone: tmoUser?.mobile || "",
        };

        // Add region_id and region name if selected
        if (selectedRegion && selectedRegionData) {
          billingAddress.region_id = parseInt(selectedRegionData.id, 10);
          billingAddress.region = selectedRegionData.name;
        }
      }

      // Ensure items are moved to checkout cart (may already be done in handleContinueToBilling)
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
                {
                  attribute_code: "district_id",
                  value: parseInt(selectedDistrict, 10),
                },
                {
                  attribute_code: "mobile_prefix",
                  value: "+86",
                },
                {
                  attribute_code: "mobile",
                  value: tmoUser?.mobile || "",
                },
              ],
            },
            default_billing: customerAddresses.length === 0, // Make default if first address
          };
          await tmoApi.createAddress(addressPayload, token);
        } catch (addrError) {
          console.warn("Could not save address for future:", addrError);
          // Don't block order placement if address save fails
        }
      }

      const newOrderId = await tmoApi.placeOrder(
        selectedPaymentMethod,
        billingAddress,
        billingAddress, // Use billing address as shipping for virtual products
        token,
      );

      setOrderId(newOrderId.toString());

      // Check if payment method requires redirect (Alipay or WeChat)
      const paymentMethodLower = selectedPaymentMethod.toLowerCase();
      const isAlipay = paymentMethodLower.includes("alipay");
      const isWeChat = paymentMethodLower.includes("wechat");

      if (isAlipay || isWeChat) {
        try {
          // Get payment URL from API
          // Note: Despite the name "getAlipayQRCode", this returns a payment redirect URL, not a QR image
          const paymentData = isAlipay
            ? await tmoApi.getAlipayQRCode(newOrderId.toString())
            : await tmoApi.getWeChatQRCode(newOrderId.toString());

          // The qr_code field contains the payment URL (e.g., https://openapi-sandbox.dl.alipaydev.com/gateway.do?...)
          const paymentUrl = paymentData?.qr_code;

          // Payment flow:
          // 1. User is redirected to Alipay/WeChat payment page
          // 2. User completes payment
          // 3. Payment gateway redirects to return_url (handled by TMO backend)
          // 4. TMO backend receives webhook notification via notify_url
          // 5. Order status is updated automatically

          if (paymentUrl && paymentUrl.trim() !== "") {
            // Show payment step
            setStep("payment");

            // DON'T clear cart yet - only clear after successful payment
            // This allows user to retry if they cancel or close the payment page
            // Cart will be cleared via webhook when payment succeeds

            // Store order ID and payment URL in localStorage for retry
            localStorage.setItem("pending_order_id", newOrderId.toString());
            localStorage.setItem("pending_payment_url", paymentUrl);
            localStorage.setItem(
              "pending_payment_method",
              selectedPaymentMethod,
            );

            if (isWeChat) {
              // For WeChat: Show QR code and poll for payment status
              setWechatPaymentUrl(paymentUrl);
              startPollingOrderStatus(newOrderId.toString());
            } else {
              // For Alipay: Redirect to payment gateway
              setTimeout(() => {
                window.location.href = paymentUrl;
              }, 1000);
            }
          } else {
            console.error("No payment URL received or empty URL");
            console.error("Payment data was:", paymentData);
            toast.error("Payment URL not available");
            setStep("complete");
            clearCart();
          }
        } catch (err) {
          console.error(
            `Error getting ${isAlipay ? "Alipay" : "WeChat"} payment URL:`,
            err,
          );
          console.error("Full error:", JSON.stringify(err, null, 2));

          // Even if payment redirect fails, order was placed successfully
          // Show the error to user
          toast.error(
            `Failed to get payment URL: ${err instanceof Error ? err.message : "Unknown error"}`,
          );

          setStep("complete");
          clearCart();
        }
      } else {
        // For other payment methods (checkmo, etc.), go directly to complete
        setStep("complete");
        clearCart();
        toast.success(t("checkout.orderPlaced"));
      }
    } catch (error) {
      console.error("Error placing order:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("checkout.orderFailed");
      toast.error(errorMessage);

      // If order failed, don't proceed to next step
      setStep("billing");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentComplete = () => {
    setStep("complete");
    clearCart();
    toast.success(t("checkout.paymentCompleted"));
  };

  // Handle moving to billing step - move items to checkout cart and fetch totals
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

      // Move items from partial cart to main checkout cart
      const itemIds = cartItems.map((item) => item.id);
      await proceedToCheckout(itemIds);

      // Fetch updated totals from main checkout cart
      try {
        const updatedTotals = await tmoApi.getTotals(token);
        setCheckoutTotals(updatedTotals);
      } catch (totalsError) {
        console.warn("Could not fetch checkout totals:", totalsError);
        // Use calculated totals from cart items as fallback
      }

      setStep("billing");
    } catch (error) {
      console.error("Error preparing checkout:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : t("checkout.checkoutPrepareFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals from cart items for display consistency
  const calculateCartSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // Use checkout totals if available (after moving to main cart), otherwise use cart totals
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0 && step !== "complete") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/store")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-foreground">{t("checkout.backToStore")}</span>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <ShoppingBag className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">{t("checkout.cartEmpty")}</p>
          <p className="text-sm mt-1">{t("checkout.addItemsToCheckout")}</p>
          <Button className="mt-6" onClick={() => router.push("/store")}>
            {t("checkout.browseStore")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => {
            if (step === "billing") setStep("review");
            else if (step === "payment") setStep("billing");
            else router.push("/store");
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2 text-foreground" />
          <span className="text-foreground">{t("checkout.back")}</span>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {t("checkout.title")}
        </h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {["review", "billing", "payment", "complete"].map((s, i) => (
          <React.Fragment key={s}>
            <div
              className={`flex items-center gap-2 ${
                step === s
                  ? "text-primary"
                  : ["review", "billing", "payment", "complete"].indexOf(step) >
                      i
                    ? "text-green-600"
                    : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : ["review", "billing", "payment", "complete"].indexOf(
                          step,
                        ) > i
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-muted-foreground"
                }`}
              >
                {["review", "billing", "payment", "complete"].indexOf(step) >
                i ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-foreground">{i + 1}</span>
                )}
              </div>
              <span className="text-sm font-medium capitalize hidden sm:inline">
                {s}
              </span>
            </div>
            {i < 3 && (
              <div className="w-8 sm:w-16 h-0.5 bg-muted-foreground/30" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      {step === "review" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Cart Items */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-foreground" />
              {t("checkout.orderSummary")}
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-3 border-b last:border-b-0"
                >
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
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
                    <p className="font-medium text-sm text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.qty} x ¥{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    ¥{item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Subtotal in Order Summary */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("checkout.itemsSubtotal")}
                </span>
                <span className="text-foreground font-medium">
                  ¥{calculateCartSubtotal().toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Order Totals */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("checkout.orderTotal")}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("checkout.subtotal")}
                </span>
                <span className="text-foreground">
                  ¥{displaySubtotal.toFixed(2)}
                </span>
              </div>
              {displayShipping > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("checkout.shipping")}
                  </span>
                  <span className="text-foreground">
                    ¥{displayShipping.toFixed(2)}
                  </span>
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
                  <span className="text-muted-foreground">
                    {t("checkout.tax")}
                  </span>
                  <span className="text-foreground">
                    ¥{displayTax.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t font-bold text-lg">
                <span className="text-foreground">{t("checkout.total")}</span>
                <span className="text-primary">
                  ¥{displayGrandTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <Button
              className="w-full mt-6"
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

      {step === "billing" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Billing Form */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-foreground" />
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
                          ? "border-primary bg-primary/5"
                          : "hover:border-muted-foreground/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="saved_address"
                        checked={selectedAddressId === addr.id && !showNewAddressForm}
                        onChange={() => handleAddressSelect(addr.id || null)}
                        className="mt-1 w-4 h-4 text-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {addr.firstname} {addr.lastname}
                          {addr.default_billing && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
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
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="saved_address"
                      checked={showNewAddressForm}
                      onChange={() => handleAddressSelect(null)}
                      className="w-4 h-4 text-primary"
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
                    className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      billingErrors.street ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {billingErrors.street && (
                    <p className="text-red-500 text-xs mt-1">
                      {billingErrors.street}
                    </p>
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
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      <option value="">{loadingRegions ? "Loading..." : t("checkout.selectRegion")}</option>
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
                      className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${
                        billingErrors.city ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">{loadingCities ? "Loading..." : "Select City"}</option>
                      {geoCities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {billingErrors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {billingErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      District
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      disabled={loadingDistricts || geoDistricts.length === 0}
                      className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      <option value="">{loadingDistricts ? "Loading..." : "Select District"}</option>
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
                    className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      billingErrors.postcode ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {billingErrors.postcode && (
                    <p className="text-red-500 text-xs mt-1">
                      {billingErrors.postcode}
                    </p>
                  )}
                </div>
                {/* Save for future checkbox */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="saveAddressForFuture"
                    checked={saveAddressForFuture}
                    onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label
                    htmlFor="saveAddressForFuture"
                    className="text-sm text-foreground"
                  >
                    {t("checkout.saveForFuture")}
                  </label>
                </div>
              </div>
            )}
          </Card>

          {/* Payment Method Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-foreground" />
              {t("checkout.paymentMethod")}
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.code}
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethod === method.code
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.code}
                    checked={selectedPaymentMethod === method.code}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="font-medium text-foreground">
                    {method.title}
                  </span>
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
                <span className="text-muted-foreground">
                  {t("checkout.subtotal")}
                </span>
                <span className="text-foreground">
                  ¥{displaySubtotal.toFixed(2)}
                </span>
              </div>
              {displayShipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("checkout.shipping")}
                  </span>
                  <span className="text-foreground">
                    ¥{displayShipping.toFixed(2)}
                  </span>
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
                  <span className="text-muted-foreground">
                    {t("checkout.tax")}
                  </span>
                  <span className="text-foreground">
                    ¥{displayTax.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span className="text-foreground">{t("checkout.total")}</span>
                <span className="text-primary">
                  ¥{displayGrandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              className="w-full mt-6"
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

      {step === "payment" && (
        <Card className="p-6 max-w-md mx-auto text-center">
          {wechatPaymentUrl ? (
            // WeChat QR Code payment
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

              {/* QR Code Image */}
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(wechatPaymentUrl)}`}
                  alt="WeChat Payment QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              {/* Order info */}
              {orderId && (
                <p className="text-sm text-muted-foreground mb-4">
                  {t("checkout.alipay.order")}:{" "}
                  <span className="font-mono">{orderId}</span>
                </p>
              )}

              {/* Polling status */}
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

              {/* Cancel button */}
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
            // Alipay redirect
            <>
              <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
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
            <Button onClick={() => router.push("/account")} className="w-full">
              {t("checkout.complete.viewOrders")}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/store")}
              className="w-full"
            >
              {t("checkout.complete.continueShopping")}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CheckoutView;
