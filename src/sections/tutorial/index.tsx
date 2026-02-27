"use client";

import { Card } from "@/components/Card";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";

const tutorialVideos = [
  {
    title: "Tutorial 1",
    url: "https://youtu.be/l1EWoGhW5OM",
    embedId: "l1EWoGhW5OM",
  },
  {
    title: "Tutorial 2",
    url: "https://www.youtube.com/watch?v=qnXMG_Bth08",
    embedId: "qnXMG_Bth08",
  },
  {
    title: "Tutorial 3",
    url: "https://youtu.be/fmIBBj_WbIA",
    embedId: "fmIBBj_WbIA",
  },
  {
    title: "Tutorial 4",
    url: "https://youtu.be/dNEkHeq8lLY",
    embedId: "dNEkHeq8lLY",
  },
  {
    title: "Tutorial 5",
    url: "https://youtu.be/HNk1e8DXXBQ",
    embedId: "HNk1e8DXXBQ",
  },
  {
    title: "Tutorial 6",
    url: "https://www.youtube.com/watch?v=tH2vzZwLksw",
    embedId: "tH2vzZwLksw",
  },
];

const showcaseVideos = [
  {
    title: "Showcase",
    url: "https://www.youtube.com/watch?v=3is2LjVvd4Y",
    embedId: "3is2LjVvd4Y",
  },
];

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
          {tutorialVideos.map((video) => (
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
          {showcaseVideos.map((video) => (
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
