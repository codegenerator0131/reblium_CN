"use client";

import { useContext, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";

import { UserContext } from "@/provider/UserContext";
import tmoApi from "@/lib/tmoApi";
import { DataLoadingComponent } from "@/components/DataLoading";

const UIComponent = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { userInfo, rolesData } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const CREDIT_PACKS = [
    {
      id: 1,
      credits: 10,
      priceUSD: 990,
      amount: 10,
      price: 9.9,
      discountPercent: 0,
      paymentLink: `https://buy.stripe.com/5kQ7sL7PZ8J13t82V9es000?client_reference_id=${userInfo.id}`,
    },
    {
      id: 2,
      credits: 50,
      priceUSD: 4490,
      amount: 50,
      price: 44.9,
      discountPercent: 0,
      paymentLink: `https://buy.stripe.com/fZuaEXeencZhd3IbrFes001?client_reference_id=${userInfo.id}`,
    },
    {
      id: 3,
      credits: 100,
      priceUSD: 7990,
      amount: 100,
      price: 79.9,
      discountPercent: 10,
      paymentLink: `https://buy.stripe.com/cNi4gz9Y7aR90gWgLZes002?client_reference_id=${userInfo.id}`,
    },
    {
      id: 4,
      credits: 500,
      priceUSD: 34990,
      amount: 500,
      price: 349.9,
      discountPercent: 15,
      paymentLink: `https://buy.stripe.com/6oUaEX4DNgbt3t8dzNes003?client_reference_id=${userInfo.id}`,
    },
    {
      id: 5,
      credits: 1000,
      priceUSD: 59990,
      amount: 1000,
      price: 599.9,
      discountPercent: 20,
      paymentLink: `https://buy.stripe.com/fZu4gz0nxe3l9Rw3Zdes004?client_reference_id=${userInfo.id}`,
    },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoadingTransactions(true);
        const token = tmoApi.getTMOToken();
        const response = await fetch("/api/credit/transactions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setTransactions(result.transactions);
        } else {
          console.error("Failed to fetch transactions:", result.error);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("credits.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("credits.subtitle")}
        </p>
      </div>

      {/* Current Balance */}
      <div className="border border-border rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {t("credits.currentBalance")}
            </p>
            <p className="text-3xl font-bold text-foreground">
              {rolesData.credits || 0} {t("credits.credits")}
            </p>
          </div>
        </div>
      </div>

      {/* Credit Packs */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          {t("credits.purchaseCredits")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CREDIT_PACKS.map((pack) => {
            const discountedPrice =
              pack.priceUSD * (1 - pack.discountPercent / 100);
            return (
              <div
                key={pack.id}
                className={`border border-border rounded-xl p-6 text-center space-y-4 hover:ring-2 hover:ring-primary transition-all relative flex flex-col justify-around items-center`}
              >
                {pack.discountPercent > 0 && (
                  <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-bold">
                    -{pack.discountPercent}%
                  </div>
                )}
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {pack.credits}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("credits.credits")}
                  </p>
                </div>
                <div>
                  {pack.discountPercent > 0 ? (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground line-through">
                        ${(pack.priceUSD / 100).toFixed(2)}
                      </p>
                      <p className="text-xl font-semibold text-primary">
                        ${(discountedPrice / 100).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xl font-semibold text-primary">
                      ${(pack.priceUSD / 100).toFixed(2)}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    window.open(pack.paymentLink, "_blank");
                  }}
                >
                  {t("credits.purchase")}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div className="pr-2">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          {t("credits.transactionHistory")}
        </h2>
        {transactions.length > 0 ? (
          <div className="max-h-[380px] overflow-x-hidden overflow-y-auto p-2 scrollbar-gutter-stable pr-2">
            <div className="border border-border rounded-xl ">
              <div className="divide-y divide-border">
                {transactions.map((transaction) => (
                  <div
                    key={transaction?.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {transaction?.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          transaction?.transaction_at,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction?.amount > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {transaction?.amount > 0 ? "+" : ""}
                        {transaction?.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("credits.balance")}: {transaction?.balance_after}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-muted-foreground border border-border rounded-xl">
            {isLoadingTransactions ? (
              <DataLoadingComponent />
            ) : (
              t("credits.noTransactions")
            )}
          </div>
        )}
      </div>
      {/* Invoices */}
      {/* <div>
        <h2 className="text-lg font-semibold mb-4 text-white">Invoices</h2>
        {FAKE_PURCHASES.length > 0 ? (
          <div className="border border-[#FFFFFF] rounded-xl">
            <div className="divide-y divide-gray-700">
              {FAKE_PURCHASES.map((purchase) => (
                <div
                  key={purchase.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-[#00cdff]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-white">
                        {purchase.credits} Credits Purchase
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Amount: €{(purchase.amountUSD / 100).toFixed(2)} •
                        Payment: {purchase.paymentMethod}
                      </p>
                      <p className="text-xs text-gray-400">
                        Date:{" "}
                        {new Date(purchase.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}{" "}
                        • Transaction ID: {purchase.transactionId}
                      </p>
                    </div>
                  </div>
                  <button
                    className="border border-white text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
                    onClick={() =>
                      toast.info("Invoice download feature coming soon!")
                    }
                  >
                    <Download className="h-4 w-4" />
                    Invoice
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-700 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-400">No invoices yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Purchase credits to generate invoices
            </p>
          </div>
        )}
      </div> */}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default function CreditView() {
  return <UIComponent />;
}
