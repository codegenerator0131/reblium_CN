import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, CreditCard, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Credits() {
  const { t } = useLanguage();
  const creditBalanceQuery = trpc.credits.getBalance.useQuery();
  const creditPacksQuery = trpc.credits.listPacks.useQuery();
  const transactionsQuery = trpc.credits.getTransactions.useQuery();
  const purchasesQuery = trpc.credits.getPurchases.useQuery();
  const utils = trpc.useUtils();
  
  const purchaseMutation = trpc.credits.purchasePack.useMutation({
    onSuccess: (data) => {
      utils.credits.getBalance.invalidate();
      utils.credits.getTransactions.invalidate();
      toast.success(t('credits.purchaseSuccess').replace('{balance}', String(data.newBalance)));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('credits.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('credits.subtitle')}</p>
        </div>

        {/* Current Balance */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('credits.currentBalance')}</p>
              <p className="text-3xl font-bold text-foreground">
                {creditBalanceQuery.data?.balance || 0} {t('credits.credits')}
              </p>
            </div>
          </div>
        </Card>

        {/* Credit Packs */}
        <div>
          <h2 className="text-lg font-semibold mb-4">{t('credits.purchaseCredits')}</h2>
          {creditPacksQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {creditPacksQuery.data?.map((pack) => {
                const discountedPrice = pack.priceUSD * (1 - pack.discountPercent / 100);
                return (
                  <Card key={pack.id} className="p-6 text-center space-y-4 hover:ring-2 hover:ring-primary transition-all relative">
                    {pack.discountPercent > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{pack.discountPercent}%
                      </div>
                    )}
                    <div>
                      <p className="text-3xl font-bold text-foreground">{pack.credits}</p>
                      <p className="text-sm text-muted-foreground">{t('credits.credits')}</p>
                    </div>
                    <div>
                      {pack.discountPercent > 0 ? (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground line-through">
                            ${(pack.priceUSD / 100).toFixed(2)}
                          </p>
                          <p className="text-xl font-semibold text-green-500">
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
                      className="w-full"
                      onClick={() => purchaseMutation.mutate({ packId: pack.id })}
                      disabled={purchaseMutation.isPending}
                    >
                      {purchaseMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        t('credits.purchase')
                      )}
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-lg font-semibold mb-4">{t('credits.transactionHistory')}</h2>
          {transactionsQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : transactionsQuery.data && transactionsQuery.data.length > 0 ? (
            <Card>
              <div className="divide-y divide-border">
                {transactionsQuery.data.map((transaction) => (
                  <div key={transaction.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('credits.balance')}: {transaction.balanceAfter}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              {t('credits.noTransactions')}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div>
          <h2 className="text-lg font-semibold mb-4">{t('credits.invoices')}</h2>
          {purchasesQuery?.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : purchasesQuery?.data && purchasesQuery.data.length > 0 ? (
            <Card>
              <div className="divide-y divide-border">
                {purchasesQuery.data.map((purchase) => (
                  <div key={purchase.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {purchase.credits} {t('credits.creditsPurchase')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('credits.amount')}: ${(purchase.amountUSD / 100).toFixed(2)} • {t('credits.payment')}: {purchase.paymentMethod}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('credits.date')}: {new Date(purchase.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric'
                          })} • {t('credits.transactionId')}: {purchase.transactionId}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toast.info(t('common.featureSoon'))}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t('credits.invoice')}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">{t('credits.noInvoices')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('credits.noInvoicesDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
