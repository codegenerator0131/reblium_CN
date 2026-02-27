"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, Store, Image, CreditCard, BookOpen } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

import { UserContext } from "@/provider/UserContext";
import { useTranslation } from "react-i18next";
import tmoApi from "@/lib/tmoApi";
import { IMAGE_BASE64_PREFIX, RECENT_PROJECTS_COUNT } from "@/Constant";

const GeneralView: React.FC = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const quickActions = [
    {
      title: t("general.quickActions.myAvatars.title"),
      description: t("general.quickActions.myAvatars.description"),
      icon: FolderOpen,
      path: "/projects",
      color: "text-blue-500",
    },
    {
      title: t("general.quickActions.browseStore.title"),
      description: t("general.quickActions.browseStore.description"),
      icon: Store,
      path: "/store",
      color: "text-purple-500",
    },
    {
      title: t("general.quickActions.tutorials.title"),
      description: t("general.quickActions.tutorials.description"),
      icon: BookOpen,
      path: "/tutorial",
      color: "text-green-500",
    },
    {
      title: t("general.quickActions.buyCredits.title"),
      description: t("general.quickActions.buyCredits.description"),
      icon: CreditCard,
      path: "/credits",
      color: "text-orange-500",
    },
  ];

  const { isAuthenticated, refetchUserData, credits } = useContext(UserContext);

  const [avatars, setAvatars] = useState([]);
  const [avatarsLoading, setAvatarsLoading] = useState(true);

  const fetchAvatars = useCallback(async () => {
    if (!isAuthenticated) return;
    setAvatarsLoading(true);
    try {
      const token = tmoApi.getTMOToken();
      const response = await fetch("/api/avatars", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch avatars");
      }
      const { success, avatars } = await response.json();
      if (success) {
        const sortedData = avatars.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setAvatars(sortedData);
      }
      setAvatarsLoading(false);
    } catch (err) {
      console.error("Error fetching avatars:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    refetchUserData();
    if (avatarsLoading) {
      fetchAvatars();
    }
  }, [isAuthenticated, fetchAvatars, avatarsLoading]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-lg h-64 md:h-80 bg-gradient-to-r from-black/40 to-black/20">
        <img
          src="images/assets/starter_pack.png"
          alt="What's New - Starters Pack"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12">
          <span className="inline-block px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full mb-4">
            {t("general.whatsNew.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t("general.whatsNew.title")}
          </h2>
          <p className="text-lg text-gray-200 mb-6 max-w-md">
            {t("general.whatsNew.description")}
          </p>
          <Button
            onClick={() => router.push("/store")}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-2"
          >
            {t("general.whatsNew.button")}
          </Button>
        </div>
      </div>
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("general.welcome.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("general.welcome.subtitle")}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("general.stats.totalProjects")}
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {avatars.length || 0}
              </p>
            </div>
            <FolderOpen className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("general.stats.creditBalance")}
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {credits || 0}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("general.stats.published")}
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">{0}</p>
            </div>
            <Image className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {t("general.quickActions.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.path}
              className="p-6 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              onClick={() => router.push(action.path)}
            >
              <action.icon className={`h-8 w-8 ${action.color} mb-3`} />
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      {avatars.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {t("general.recentProjects.title")}
            </h2>
            <Button variant="link" onClick={() => router.push("/projects")}>
              {t("general.recentProjects.viewAll")}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {avatars.slice(0, RECENT_PROJECTS_COUNT).map((project) => (
              <Card
                key={project.id}
                className="group relative aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all !py-0"
                onClick={() => router.push("/projects")}
              >
                {project.image ? (
                  <img
                    src={`${IMAGE_BASE64_PREFIX}${project?.image}`}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">
                      {t("general.recentProjects.noPreview")}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white text-sm font-medium truncate">
                    {project.name}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralView;
