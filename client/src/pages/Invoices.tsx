import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Invoices() {
  const { t } = useLanguage();
  const invoicesQuery = trpc.invoices.list.useQuery();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('credits.invoices')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('invoices.subtitle')}</p>
        </div>

        {invoicesQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : invoicesQuery.data && invoicesQuery.data.length > 0 ? (
          <Card>
            <div className="divide-y divide-border">
              {invoicesQuery.data.map((invoice) => (
                <div key={invoice.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-sm">{t('credits.creditsPurchase')}</p>
                      <Badge className={getStatusColor(invoice.paymentStatus)}>
                        {invoice.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {invoice.credits} {t('credits.credits')} • ${(invoice.amountUSD / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleString()}
                    </p>
                    {invoice.paymentMethod && (
                      <p className="text-xs text-muted-foreground">
                        {t('credits.payment')}: {invoice.paymentMethod}
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    {t('credits.invoice')}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            {t('credits.noInvoices')}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
