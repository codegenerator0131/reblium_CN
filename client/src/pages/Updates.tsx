import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Download, CheckCircle, AlertCircle, Code } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const CURRENT_VERSION = "2025.3.0";

export default function Updates() {
  const { t } = useLanguage();
  const versionsQuery = trpc.updates.listVersions.useQuery();
  const sdksQuery = trpc.sdks.list.useQuery();
  const [downloadingVersion, setDownloadingVersion] = useState<string | null>(null);
  const [downloadingSDK, setDownloadingSDK] = useState<number | null>(null);

  const handleDownload = (version: string, downloadUrl: string) => {
    setDownloadingVersion(version);
    setTimeout(() => {
      toast.success(t('updates.downloadSuccess').replace('{version}', version));
      setDownloadingVersion(null);
      window.open(downloadUrl, "_blank");
    }, 1500);
  };

  const handleSDKDownload = (sdkName: string, downloadUrl: string, sdkId: number) => {
    setDownloadingSDK(sdkId);
    setTimeout(() => {
      toast.success(t('updates.sdkDownloadSuccess').replace('{name}', sdkName));
      setDownloadingSDK(null);
      window.open(downloadUrl, "_blank");
    }, 1500);
  };

  const isNewerVersion = (version: string) => {
    const current = CURRENT_VERSION.split(".").map(Number);
    const target = version.split(".").map(Number);
    for (let i = 0; i < 3; i++) {
      if (target[i] > current[i]) return true;
      if (target[i] < current[i]) return false;
    }
    return false;
  };

  const isOlderVersion = (version: string) => {
    const current = CURRENT_VERSION.split(".").map(Number);
    const target = version.split(".").map(Number);
    for (let i = 0; i < 3; i++) {
      if (target[i] < current[i]) return true;
      if (target[i] > current[i]) return false;
    }
    return false;
  };

  const getBuildType = (version: string) => {
    if (version.includes("beta")) return t('updates.beta');
    return t('updates.final');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('updates.title')}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t('updates.currentVersion')}: <span className="font-semibold">{CURRENT_VERSION}</span>
          </p>
        </div>

        <Tabs defaultValue="software" className="w-full">
          <TabsList className="h-16 p-2 grid w-full grid-cols-2">
            <TabsTrigger value="software" className="capitalize text-2xl px-8 py-4 data-[state=active]:text-2xl data-[state=active]:text-cyan-300 data-[state=active]:font-bold">
              {t('updates.softwareUpdates')}
            </TabsTrigger>
            <TabsTrigger value="sdks" className="capitalize text-2xl px-8 py-4 data-[state=active]:text-2xl data-[state=active]:text-cyan-300 data-[state=active]:font-bold">
              {t('updates.sdks')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="software" className="space-y-4">
            {versionsQuery.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">{t('updates.loadingVersions')}</p>
              </div>
            ) : versionsQuery.data && versionsQuery.data.length > 0 ? (
              <div className="space-y-4">
                {versionsQuery.data.map((version) => {
                  const isNewer = isNewerVersion(version.version);
                  const isOlder = isOlderVersion(version.version);
                  const isCurrent = version.version === CURRENT_VERSION;

                  return (
                    <Card key={version.id} className="overflow-hidden">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-xl font-semibold text-foreground">
                                {version.displayName}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                v{version.version}
                              </Badge>
                              {isCurrent && (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {t('updates.current')}
                                </Badge>
                              )}
                              {isNewer && (
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  {t('updates.newer')}
                                </Badge>
                              )}
                              {isOlder && (
                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                  {t('updates.older')}
                                </Badge>
                              )}
                              <Badge variant="outline" className={getBuildType(version.version) === t('updates.beta') ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}>
                                {getBuildType(version.version)}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              {t('updates.released')}: {new Date(version.releaseDate).toLocaleDateString()}
                            </p>

                            {version.description && (
                              <p className="text-sm text-foreground mt-2">{version.description}</p>
                            )}

                            {version.releaseNotes && (
                              <div className="mt-4 pt-4 border-t border-border">
                                <h4 className="text-sm font-semibold text-foreground mb-2">
                                  {t('updates.releaseNotes')}
                                </h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                                  {version.releaseNotes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => handleDownload(version.version, version.downloadUrl)}
                              disabled={downloadingVersion === version.version}
                              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold whitespace-nowrap"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {downloadingVersion === version.version ? t('updates.downloading') : t('updates.download')}
                            </Button>
                            
                            {version.fileSize && (
                              <p className="text-xs text-muted-foreground text-center">
                                {(version.fileSize / 1024 / 1024).toFixed(2)} MB
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                {t('updates.noVersions')}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sdks" className="space-y-4">
            {sdksQuery.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">{t('updates.loadingSDKs')}</p>
              </div>
            ) : sdksQuery.data && sdksQuery.data.length > 0 ? (
              <div className="space-y-4">
                {sdksQuery.data.map((sdk) => (
                  <Card key={sdk.id} className="overflow-hidden">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        {sdk.logoUrl && (
                          <div className="flex-shrink-0">
                            <img src={sdk.logoUrl} alt={sdk.name} className="h-20 w-20 object-contain" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Code className="h-5 w-5 text-cyan-500" />
                            <h3 className="text-xl font-semibold text-foreground">{sdk.name}</h3>
                            <Badge variant="outline" className="text-xs">{sdk.engine}</Badge>
                            <Badge variant="outline" className="text-xs bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                              v{sdk.version}
                            </Badge>
                            {!sdk.downloadUrl && (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                {t('tutorialsPanel.comingSoon')}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {t('updates.released')}: {new Date(sdk.releaseDate).toLocaleDateString()}
                          </p>

                          {sdk.description && (
                            <p className="text-sm text-foreground mt-2">{sdk.description}</p>
                          )}

                          {sdk.documentationUrl && (
                            <div className="mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => sdk.documentationUrl && window.open(sdk.documentationUrl, "_blank")}
                                className="text-xs"
                              >
                                {t('updates.viewDocs')}
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleSDKDownload(sdk.name, sdk.downloadUrl, sdk.id)}
                            disabled={downloadingSDK === sdk.id || !sdk.downloadUrl}
                            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {!sdk.downloadUrl ? t('tutorialsPanel.comingSoon') : downloadingSDK === sdk.id ? t('updates.downloading') : t('updates.download')}
                          </Button>
                          
                          {sdk.fileSize && (
                            <p className="text-xs text-muted-foreground text-center">
                              {(sdk.fileSize).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                {t('updates.noSDKs')}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
