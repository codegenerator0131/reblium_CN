import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, FileText, ExternalLink, Shield, Briefcase, Gamepad2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Licenses() {
  const { t } = useLanguage();
  const licensesQuery = trpc.licenses.list.useQuery();

  const licenseTypes = [
    {
      icon: Shield,
      name: t('history.personalLicense'),
      description: t('history.personalLicenseDesc'),
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      details: [
        t('licenses.personal1'),
        t('licenses.personal2'),
        t('licenses.personal3'),
        t('licenses.personal4'),
        t('licenses.personal5'),
      ]
    },
    {
      icon: Briefcase,
      name: t('history.commercialLicense'),
      description: t('history.commercialLicenseDesc'),
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      details: [
        t('licenses.commercial1'),
        t('licenses.commercial2'),
        t('licenses.commercial3'),
        t('licenses.commercial4'),
        t('licenses.commercial5'),
        t('licenses.commercial6'),
      ]
    },
    {
      icon: Gamepad2,
      name: t('history.indieLicense'),
      description: t('history.indieLicenseDesc'),
      color: "bg-green-500/10 text-green-500 border-green-500/20",
      details: [
        t('licenses.indie1'),
        t('licenses.indie2'),
        t('licenses.indie3'),
        t('licenses.indie4'),
        t('licenses.indie5'),
        t('licenses.indie6'),
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('licenses.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('licenses.subtitle')}</p>
        </div>

        {/* License Types Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{t('licenses.types')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('licenses.typesDesc')}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {licenseTypes.map((license) => {
              const Icon = license.icon;
              return (
                <Card key={license.name} className="border-2">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border ${license.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{license.name}</CardTitle>
                        <CardDescription className="mt-1">{license.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">{t('licenses.whatsIncluded')}</p>
                      <ul className="space-y-1.5">
                        {license.details.map((detail, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Legal Links Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{t('licenses.legalDocs')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('licenses.legalDocsDesc')}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{t('licenses.termsTitle')}</CardTitle>
                      <CardDescription className="mt-1">{t('licenses.termsDesc')}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="https://genji.com/terms" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">EULA</CardTitle>
                      <CardDescription className="mt-1">{t('licenses.eulaDesc')}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="https://genji.com/eula" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Active Licenses Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{t('licenses.activeLicenses')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('licenses.activeLicensesDesc')}</p>
          </div>

          {licensesQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : licensesQuery.data && licensesQuery.data.length > 0 ? (
            <div className="grid gap-4">
              {licensesQuery.data.map((license) => (
                <Card key={license.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{license.licenseType}</CardTitle>
                          <Badge variant={license.status === "active" ? "default" : "secondary"}>
                            {license.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          {t('licenses.licenseKey')}: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{license.licenseKey}</code>
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{t('licenses.created')}: {new Date(license.createdAt).toLocaleDateString()}</p>
                        {license.expiresAt && (
                          <p>{t('licenses.expires')}: {new Date(license.expiresAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-center">{t('licenses.noLicenses')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
