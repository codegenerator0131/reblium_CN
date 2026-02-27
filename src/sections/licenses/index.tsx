"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import {
  Loader2,
  Shield,
  Briefcase,
  Gamepad2,
  Package,
} from "lucide-react";
import { Separator } from "@/components/Separator";
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "@/provider/UserContext";
import tmoApi from "@/lib/tmoApi";

interface UserAsset {
  asset_id: number;
  asset_name: string;
  asset_artist_name: string;
  asset_url: string;
  license_type: "personal" | "commercial";
  purchase_date: string;
  is_pack: number;
}

export default function Licenses() {
  const { t } = useTranslation("common");
  const { isAuthenticated } = useContext(UserContext);
  const [userAssets, setUserAssets] = useState<UserAsset[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const licenseTypes = [
    {
      icon: Shield,
      name: t("licenses.personal.name"),
      description: t("licenses.personal.description"),
      color: "bg-primary/10 text-primary border-primary/20",
      details: [
        t("licenses.personal.details.0"),
        t("licenses.personal.details.1"),
        t("licenses.personal.details.2"),
        t("licenses.personal.details.3"),
        t("licenses.personal.details.4"),
      ],
    },
    {
      icon: Briefcase,
      name: t("licenses.commercial.name"),
      description: t("licenses.commercial.description"),
      color: "bg-accent text-accent-foreground border-border",
      details: [
        t("licenses.commercial.details.0"),
        t("licenses.commercial.details.1"),
        t("licenses.commercial.details.2"),
        t("licenses.commercial.details.3"),
        t("licenses.commercial.details.4"),
        t("licenses.commercial.details.5"),
      ],
    },
    {
      icon: Gamepad2,
      name: t("licenses.indieGame.name"),
      description: t("licenses.indieGame.description"),
      color: "bg-secondary text-secondary-foreground border-border",
      details: [
        t("licenses.indieGame.details.0"),
        t("licenses.indieGame.details.1"),
        t("licenses.indieGame.details.2"),
        t("licenses.indieGame.details.3"),
        t("licenses.indieGame.details.4"),
        t("licenses.indieGame.details.5"),
      ],
    },
  ];

  useEffect(() => {
    const fetchUserAssets = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const token = tmoApi.getTMOToken();
        const response = await fetch("/api/userAssets/licenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user assets");
        }

        const data = await response.json();
        setUserAssets(data);
      } catch (error) {
        console.error("Error fetching user assets:", error);
        setUserAssets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAssets();
  }, [isAuthenticated]);

  const getLicenseBadgeColor = (licenseType: string) => {
    if (licenseType === "commercial") {
      return "bg-accent/50 text-accent-foreground border-border";
    }
    return "bg-primary/10 text-primary border-primary/50";
  };

  const groupAssetsByLicense = () => {
    if (!userAssets) return { personal: [], commercial: [] };

    const personal = userAssets.filter(
      (asset) => asset.license_type === "personal"
    );
    const commercial = userAssets.filter(
      (asset) => asset.license_type === "commercial"
    );

    return { personal, commercial };
  };

  const { personal, commercial } = groupAssetsByLicense();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("licenses.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("licenses.subtitle")}
        </p>
      </div>

      {/* License Types */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {t("licenses.licenseTypes.title")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("licenses.licenseTypes.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {licenseTypes.map((license) => {
            const Icon = license.icon;
            return (
              <Card
                key={license.name}
                className="border-2 hover:border-primary/30 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${license.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{license.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {license.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      {t("licenses.whatsIncluded")}
                    </p>
                    <ul className="space-y-1.5">
                      {license.details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
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
      </section>

      <Separator />

      {/* Active Licenses */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {t("licenses.activeLicenses.title")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("licenses.activeLicenses.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !isAuthenticated ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                {t("licenses.signInToView")}
              </p>
            </CardContent>
          </Card>
        ) : userAssets && userAssets.length > 0 ? (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("licenses.stats.totalAssets")}
                      </p>
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {userAssets.length}
                      </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("licenses.stats.commercial")}
                      </p>
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {commercial.length}
                      </p>
                    </div>
                    <div className="p-3 bg-accent/50 rounded-lg">
                      <Briefcase className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("licenses.stats.personal")}
                      </p>
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {personal.length}
                      </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commercial Licenses */}
            {commercial.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-border">
                  <div className="p-2 bg-accent/50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {t("licenses.commercialLicenses")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("licenses.commercialDescription", {
                        count: commercial.length,
                        asset:
                          commercial.length === 1
                            ? t("licenses.asset")
                            : t("licenses.assets"),
                      })}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {commercial.map((asset) => (
                    <Card
                      key={asset.asset_id}
                      className="group overflow-hidden border-border hover:border-primary/50 transition-all hover:shadow-lg"
                    >
                      <div className="relative">
                        <div className="bg-muted h-48 flex items-center justify-center overflow-hidden">
                          <img
                            src={`/images/${asset.asset_url}`}
                            alt={asset.asset_artist_name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {asset.is_pack === 1 && (
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-bold shadow-lg">
                            <Package className="h-3.5 w-3.5" />
                            Pack
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {asset.asset_artist_name}
                            </h4>
                            <Badge className="bg-primary/10 text-primary border-primary/20 shrink-0">
                              {t("licenses.commercialLabel")}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                              {t("licenses.active")}
                            </span>
                            <span>
                              {new Date(asset.purchase_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Licenses */}
            {personal.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-border">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {t("licenses.personalLicenses")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("licenses.personalDescription", {
                        count: personal.length,
                        asset:
                          personal.length === 1
                            ? t("licenses.asset")
                            : t("licenses.assets"),
                      })}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {personal.map((asset) => (
                    <Card
                      key={asset.asset_id}
                      className="group overflow-hidden border-border hover:border-primary/50 transition-all hover:shadow-lg"
                    >
                      <div className="relative">
                        <div className="bg-muted h-48 flex items-center justify-center overflow-hidden">
                          <img
                            src={`/images/${asset.asset_url}`}
                            alt={asset.asset_artist_name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {asset.is_pack === 1 && (
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-bold shadow-lg">
                            <Package className="h-3.5 w-3.5" />
                            Pack
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {asset.asset_artist_name}
                            </h4>
                            <Badge className="bg-primary/10 text-primary border-primary/20 shrink-0">
                              {t("licenses.personalLabel")}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                              {t("licenses.active")}
                            </span>
                            <span>
                              {new Date(asset.purchase_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-muted rounded-full mb-4">
                <Shield className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("licenses.noLicenses.title")}
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {t("licenses.activeLicenses.noLicenses")}
              </p>
              <Button className="mt-6" asChild>
                <a href="/store">{t("licenses.noLicenses.browseStore")}</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
