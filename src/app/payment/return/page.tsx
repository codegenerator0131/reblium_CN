"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import tmoApi from "@/lib/tmoApi";
import { TMOOrder } from "@/types/tmo";

export default function PaymentReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"checking" | "success" | "failed" | "pending">("checking");
  const [order, setOrder] = useState<TMOOrder | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      // Get order ID from URL params or localStorage
      const orderIdFromUrl = searchParams.get("order_id");
      const orderIdFromStorage = localStorage.getItem("pending_order_id");
      const currentOrderId = orderIdFromUrl || orderIdFromStorage;

      if (!currentOrderId) {
        setStatus("failed");
        return;
      }

      try {
        const token = tmoApi.getTMOToken();
        if (!token) {
          setStatus("failed");
          return;
        }

        // Check order status via API
        const orderData = await tmoApi.getOrderDetail(parseInt(currentOrderId), token);
        setOrder(orderData);

        console.log("Order fetched:", {
          entity_id: orderData.entity_id,
          increment_id: orderData.increment_id,
          status: orderData.status,
          state: orderData.state,
          grand_total: orderData.grand_total,
        });

        // Determine status based on order state and status
        const orderStatus = orderData.status.toLowerCase();
        const orderState = orderData.state?.toLowerCase();

        // Success: Order is processing or complete
        if (
          orderStatus === "processing" ||
          orderStatus === "complete" ||
          orderStatus === "paid" ||
          orderState === "processing" ||
          orderState === "complete"
        ) {
          setStatus("success");
          // Clear pending order data
          localStorage.removeItem("pending_order_id");
          localStorage.removeItem("pending_payment_url");
          localStorage.removeItem("pending_payment_method");
        }
        // Pending: Order is created but payment not completed
        else if (
          orderStatus === "pending" ||
          orderStatus === "pending_payment" ||
          orderState === "new" ||
          orderState === "pending_payment"
        ) {
          setStatus("pending");
        }
        // Failed: Order is canceled, closed, or failed
        else if (
          orderStatus === "canceled" ||
          orderStatus === "cancelled" ||
          orderStatus === "closed" ||
          orderStatus === "failed" ||
          orderState === "canceled" ||
          orderState === "closed"
        ) {
          setStatus("failed");
        }
        // Default to pending for unknown statuses
        else {
          console.warn("Unknown order status:", orderStatus, "state:", orderState);
          setStatus("pending");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        // If we can't fetch the order, show error state
        setStatus("failed");
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const handleRetryPayment = () => {
    const paymentUrl = localStorage.getItem("pending_payment_url");
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center">
        {status === "checking" && (
          <>
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Checking Payment Status</h1>
            <p className="text-muted-foreground">Please wait while we verify your payment...</p>
          </>
        )}

        {status === "success" && order && (
          <>
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-4">
              Your payment has been confirmed.
            </p>

            <div className="bg-muted p-4 rounded-lg mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-semibold">#{order.increment_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold">
                    {order.order_currency_code} {order.grand_total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-semibold">{order.items?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-semibold capitalize">
                    {order.payment?.extension_attributes?.method_label || order.payment?.method || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={() => router.push("/orders")} className="w-full">
                View Orders
              </Button>
              <Button onClick={() => router.push("/store")} variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </div>
          </>
        )}

        {status === "pending" && (
          <>
            <Clock className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Payment Pending</h1>
            <p className="text-muted-foreground mb-4">
              Your order has been created but payment has not been completed yet.
            </p>

            {order && (
              <div className="bg-muted p-4 rounded-lg mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number:</span>
                    <span className="font-semibold">#{order.increment_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Due:</span>
                    <span className="font-semibold">
                      {order.order_currency_code} {order.grand_total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-semibold capitalize">
                      {order.payment?.extension_attributes?.method_label || order.payment?.method || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Button onClick={handleRetryPayment} className="w-full">
                Complete Payment
              </Button>
              <Button onClick={() => router.push("/orders")} variant="outline" className="w-full">
                View Orders
              </Button>
              <Button onClick={() => router.push("/store")} variant="outline" className="w-full">
                Back to Store
              </Button>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Payment Not Completed</h1>
            <p className="text-muted-foreground mb-4">
              {order
                ? "Your order could not be completed. Please try again."
                : "Unable to retrieve order information. Please check your orders page or try again."}
            </p>

            {order && (
              <div className="bg-muted p-4 rounded-lg mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number:</span>
                    <span className="font-semibold">#{order.increment_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold capitalize text-red-600">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Button onClick={() => router.push("/checkout")} className="w-full">
                Try Again
              </Button>
              <Button onClick={() => router.push("/orders")} variant="outline" className="w-full">
                View Orders
              </Button>
              <Button onClick={() => router.push("/store")} variant="outline" className="w-full">
                Back to Store
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
