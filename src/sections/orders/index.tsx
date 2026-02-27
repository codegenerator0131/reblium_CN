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
  isOrderSuccess,
  isOrderFailed,
  ORDER_POLLING_INTERVAL_MS,
  ORDERS_PER_PAGE,
} from "@/Constant";
import {
  Package,
  Search,
  Filter,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  ShoppingBag,
  QrCode,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { UserContext } from "@/provider/UserContext";
import tmoApi from "@/lib/tmoApi";
import { TMOOrder, MappedOrder } from "@/types/tmo";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useTranslation } from "react-i18next";

export default function OrdersView() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { isAuthenticated, tmoUser } = useContext(UserContext);

  const [orders, setOrders] = useState<MappedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<MappedOrder | null>(null);
  const ordersPerPage = ORDERS_PER_PAGE;

  // WeChat payment state
  const [wechatPaymentUrl, setWechatPaymentUrl] = useState<string | null>(null);
  const [wechatPaymentOrderId, setWechatPaymentOrderId] = useState<
    string | null
  >(null);
  const [isPollingPayment, setIsPollingPayment] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingOrderIdRef = useRef<string | null>(null);

  // Stop polling function
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPollingPayment(false);
    pollingOrderIdRef.current = null;
  }, []);

  // Load orders function
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = tmoApi.getTMOToken();
      if (!token) {
        toast.error(t("orders.notAuthenticated"));
        return;
      }

      const response = await tmoApi.getOrders(token);

      // Map orders to display format
      // Handle both response formats: direct array or wrapped in items
      const ordersArray = Array.isArray(response)
        ? response
        : response.items || [];
      const mappedOrders = ordersArray.map((order: TMOOrder) =>
        tmoApi.mapTMOOrderToMapped(order),
      );

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error(t("orders.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
            setWechatPaymentOrderId(null);
            toast.success(t("checkout.paymentCompleted"));
            // Reload orders to reflect the updated status
            loadOrders();
          }

          // Payment failed statuses
          if (isOrderFailed(status || "")) {
            stopPolling();
            setWechatPaymentUrl(null);
            setWechatPaymentOrderId(null);
            toast.error(t("checkout.orderFailed"));
          }
        } catch (error) {
          console.error("Error polling order status:", error);
          // Don't stop polling on transient errors, just log them
        }
      }, ORDER_POLLING_INTERVAL_MS);
    },
    [stopPolling, t, loadOrders],
  );

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Load orders on mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    loadOrders();
  }, [isAuthenticated, loadOrders]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      order.incrementId.toLowerCase().includes(searchLower) ||
      order.id.toString().includes(searchQuery) ||
      order.items.some(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.sku.toLowerCase().includes(searchLower),
      );

    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  // Load order detail
  const handleViewOrder = async (orderId: number) => {
    try {
      const token = tmoApi.getTMOToken();
      if (!token) return;

      const orderDetail = await tmoApi.getOrderDetail(orderId, token);
      const mapped = tmoApi.mapTMOOrderToMapped(orderDetail);
      setSelectedOrder(mapped);
    } catch (error) {
      console.error("Error loading order detail:", error);
      toast.error(t("orders.detailLoadFailed"));
    }
  };

  // Retry payment for pending order
  const handleRetryPayment = async (order: MappedOrder) => {
    try {
      const token = tmoApi.getTMOToken();
      if (!token) {
        toast.error(t("orders.notAuthenticated"));
        return;
      }

      toast.loading(t("orders.redirectingToPayment"));

      let paymentUrl: string;
      const paymentMethodLower = order.paymentMethod.toLowerCase();
      const isAlipay = paymentMethodLower.includes("alipay");
      const isWeChat = paymentMethodLower.includes("wechat");

      // Get payment URL based on payment method
      if (isAlipay) {
        const response = await tmoApi.getAlipayQRCode(order.incrementId);
        paymentUrl = response.qr_code;
      } else if (isWeChat) {
        const response = await tmoApi.getWeChatQRCode(order.incrementId);
        paymentUrl = response.qr_code;
      } else {
        toast.error(t("orders.paymentMethodNotSupported"));
        return;
      }

      // Store pending payment info
      localStorage.setItem("pending_order_id", order.incrementId);
      localStorage.setItem("pending_payment_url", paymentUrl);
      localStorage.setItem("pending_payment_method", order.paymentMethod);

      toast.dismiss();

      if (isWeChat) {
        // For WeChat: Show QR code modal and poll for payment status
        setWechatPaymentUrl(paymentUrl);
        setWechatPaymentOrderId(order.incrementId);
        setSelectedOrder(null); // Close the order detail modal if open
        startPollingOrderStatus(order.id.toString());
      } else {
        // For Alipay: Redirect to payment gateway
        setTimeout(() => {
          window.location.href = paymentUrl;
        }, 1000);
      }
    } catch (error) {
      console.error("Error retrying payment:", error);
      toast.dismiss();
      toast.error(t("orders.retryPaymentFailed"));
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (
      statusLower.includes("complete") ||
      statusLower.includes("processing")
    ) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
    if (statusLower.includes("pending")) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
    if (statusLower.includes("cancel") || statusLower.includes("failed")) {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("orders.title")}
          </h1>
          <p className="text-muted-foreground">{t("orders.subtitle")}</p>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("orders.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value="all">{t("orders.statusAll")}</option>
                <option value="pending">{t("orders.statusPending")}</option>
                <option value="processing">
                  {t("orders.statusProcessing")}
                </option>
                <option value="complete">{t("orders.statusComplete")}</option>
                <option value="canceled">{t("orders.statusCanceled")}</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        {paginatedOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t("orders.noOrders")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("orders.noOrdersDesc")}
            </p>
            <Button onClick={() => router.push("/store")}>
              {t("orders.startShopping")}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <Card
                key={order.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {t("orders.orderNumber")} #{order.incrementId}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ShoppingBag className="h-4 w-4" />
                        <span>
                          {order.totalQty} {t("orders.items")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>${order.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t("orders.viewDetails")}
                    </Button>
                    {order.status.toLowerCase() === "pending" && (
                      <Button onClick={() => handleRetryPayment(order)}>
                        {t("orders.retryPayment")}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {t("orders.page")} {currentPage} {t("orders.of")} {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <Card
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {t("orders.orderNumber")} #{selectedOrder.incrementId}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedOrder.status,
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t("orders.orderItems")}
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-foreground">
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("orders.sku")}: {item.sku}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            ${item.price.toFixed(2)} x {item.qty}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${item.subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Address */}
              {selectedOrder.billingAddress && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {t("orders.billingAddress")}
                  </h3>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-foreground">
                      {selectedOrder.billingAddress.firstname}{" "}
                      {selectedOrder.billingAddress.lastname}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedOrder.billingAddress.street?.join(", ")}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedOrder.billingAddress.city},{" "}
                      {selectedOrder.billingAddress.postcode}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedOrder.billingAddress.country_id}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedOrder.billingAddress.telephone}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t("orders.orderSummary")}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("orders.subtotal")}</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.shippingAmount > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("orders.shipping")}</span>
                      <span>${selectedOrder.shippingAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.taxAmount > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t("orders.tax")}</span>
                      <span>${selectedOrder.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.discountAmount !== 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{t("orders.discount")}</span>
                      <span>
                        -${Math.abs(selectedOrder.discountAmount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t">
                    <span>{t("orders.total")}</span>
                    <span>${selectedOrder.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {t("orders.paymentMethod")}:{" "}
                    <span className="font-medium text-foreground">
                      {selectedOrder.paymentMethod}
                    </span>
                  </p>
                </div>

                {/* Retry Payment Button */}
                {selectedOrder.status.toLowerCase() === "pending" && (
                  <div className="mt-6">
                    <Button
                      className="w-full"
                      onClick={() => handleRetryPayment(selectedOrder)}
                    >
                      {t("orders.retryPayment")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* WeChat Payment QR Code Modal */}
      {wechatPaymentUrl && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            stopPolling();
            setWechatPaymentUrl(null);
            setWechatPaymentOrderId(null);
          }}
        >
          <Card
            className="max-w-md w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
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
            {wechatPaymentOrderId && (
              <p className="text-sm text-muted-foreground mb-4">
                {t("checkout.alipay.order")}:{" "}
                <span className="font-mono">{wechatPaymentOrderId}</span>
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
                setWechatPaymentOrderId(null);
              }}
              className="mt-2"
            >
              {t("checkout.back")}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
