"use client";

import { Card } from "@/components/Card";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TUTORIAL_VIDEOS, SHOWCASE_VIDEOS } from "@/Constant";

export default function Tutorials() {
  const { t } = useTranslation("common");

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("tutorials.title")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("tutorials.subtitle")}</p>
      </div>

      {/* Tutorials Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">
          {t("tutorials.gettingStarted")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TUTORIAL_VIDEOS.map((video) => (
            <Card
              key={video.embedId}
              className="overflow-hidden hover:ring-2 hover:ring-primary transition-all"
            >
              <div className="relative aspect-video bg-black flex items-center justify-center group cursor-pointer">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.embedId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{video.title}</h3>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-2 inline-flex items-center gap-1"
                >
                  <Play className="h-3 w-3" />
                  {t("tutorials.watchOnYouTube")}
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Showcase Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">
          {t("tutorials.showcase")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SHOWCASE_VIDEOS.map((video) => (
            <Card
              key={video.embedId}
              className="overflow-hidden hover:ring-2 hover:ring-primary transition-all"
            >
              <div className="relative aspect-video bg-black flex items-center justify-center group cursor-pointer">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.embedId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{video.title}</h3>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-2 inline-flex items-center gap-1"
                >
                  <Play className="h-3 w-3" />
                  {t("tutorials.watchOnYouTube")}
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
