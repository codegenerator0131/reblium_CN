import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Download, FileDown, CreditCard, Shield, Briefcase, Gamepad2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

type LicenseType = "Personal License" | "Commercial License" | "Indie Game License";

export default function History() {
  const { t } = useLanguage();
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>("Personal License");
  const [pendingDownload, setPendingDownload] = useState<{
    url: string;
    projectId: number;
    format: string;
    cost: number;
  } | null>(null);

  const { user } = useAuth();
  const downloadsQuery = trpc.downloads.list.useQuery();
  const projectsQuery = trpc.avatarProjects.list.useQuery();
  const utils = trpc.useUtils();

  const licenseOptions = [
    {
      value: "Personal License",
      label: t('history.personalLicense'),
      description: t('history.personalLicenseDesc'),
      icon: Shield,
      color: "text-blue-500"
    },
    {
      value: "Commercial License",
      label: t('history.commercialLicense'),
      description: t('history.commercialLicenseDesc'),
      icon: Briefcase,
      color: "text-purple-500"
    },
    {
      value: "Indie Game License",
      label: t('history.indieLicense'),
      description: t('history.indieLicenseDesc'),
      icon: Gamepad2,
      color: "text-green-500"
    }
  ];

  const createLicenseMutation = trpc.licenses.create.useMutation({
    onSuccess: () => {
      utils.licenses.list.invalidate();
      if (pendingDownload) {
        toast.success(t('history.downloadingWith').replace('{license}', selectedLicense));
        window.open(pendingDownload.url, '_blank');
      }
      setLicenseDialogOpen(false);
      setPendingDownload(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getProjectName = (projectId: number) => {
    const project = projectsQuery.data?.find(p => p.id === projectId);
    return project?.name || `Project #${projectId}`;
  };

  const handleDownload = (url: string, projectId: number, format: string, cost: number) => {
    const userCredits = user?.creditBalance || 0;
    
    if (userCredits < cost) {
      toast.error(
        t('history.insufficientCredits'),
        {
          description: t('history.insufficientCreditsDesc'),
          action: {
            label: t('history.buyCredits'),
            onClick: () => window.location.href = "/credits"
          }
        }
      );
      return;
    }

    setPendingDownload({ url, projectId, format, cost });
    setLicenseDialogOpen(true);
  };

  const confirmDownload = () => {
    if (!pendingDownload) return;
    createLicenseMutation.mutate({ licenseType: selectedLicense });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('history.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('history.subtitle')}</p>
        </div>

        {downloadsQuery.isLoading || projectsQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : downloadsQuery.data && downloadsQuery.data.length > 0 ? (
          <Card>
            <div className="divide-y divide-border">
              {downloadsQuery.data.map((download) => (
                <div key={download.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileDown className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {getProjectName(download.avatarProjectId)}_Export.{download.format}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('history.format')}: {download.format?.toUpperCase()} • {t('history.cost')}: {download.creditCost} {t('credits.credits')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('history.downloaded')}: {new Date(download.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownload(
                      download.assetUrl, 
                      download.avatarProjectId, 
                      download.format || 'file',
                      download.creditCost
                    )}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('updates.download')}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg">
            <FileDown className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">{t('history.noDownloads')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('history.noDownloadsDesc')}</p>
          </div>
        )}
      </div>

      {/* License Selection Dialog */}
      <Dialog open={licenseDialogOpen} onOpenChange={setLicenseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('history.selectLicense')}</DialogTitle>
            <DialogDescription>{t('history.selectLicenseDesc')}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <RadioGroup value={selectedLicense} onValueChange={(value) => setSelectedLicense(value as LicenseType)}>
              <div className="space-y-3">
                {licenseOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.value} className="flex items-start space-x-3 space-y-0">
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <Icon className={`h-5 w-5 ${option.color} mt-0.5`} />
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            {pendingDownload && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {t('history.downloadCost').replace('{cost}', String(pendingDownload.cost))}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setLicenseDialogOpen(false);
                setPendingDownload(null);
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={confirmDownload}
              disabled={createLicenseMutation.isPending}
            >
              {createLicenseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('history.processing')}
                </>
              ) : (
                t('history.confirmDownload')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
