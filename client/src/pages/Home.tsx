import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { FolderOpen, Store, BookOpen, Calendar, MapPin, ChevronRight, ChevronLeft, Newspaper } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useCallback } from "react";

interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  buttonLabel: string;
  link: string;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const pressReleasePreview = {
    id: "genji-launch",
    title: t('blog.genjiTitle'),
    date: t('blog.genjiDate'),
    location: t('blog.genjiLocation'),
    category: t('blog.pressRelease'),
    coverImage: "/assets/images/banner-genji.png",
    excerpt: t('blog.genjiExcerpt'),
  };

  const bannerSlides: BannerSlide[] = [
    {
      id: "starters-pack",
      tag: t('home.whatsNew'),
      title: t('home.startersPack'),
      description: t('home.startersDesc'),
      image: "/assets/images/starter-pack.png",
      buttonLabel: t('home.exploreNow'),
      link: "/store",
    },
    {
      id: "genji-press-release",
      tag: t('blog.pressRelease'),
      title: t('blog.genjiCarouselTitle'),
      description: t('blog.genjiCarouselDesc'),
      image: "/assets/images/banner-genji.png",
      buttonLabel: t('blog.readArticle'),
      link: "/blog/genji-launch",
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  }, [bannerSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  }, [bannerSlides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const quickActions = [
    {
      title: t('avatars.projects'),
      description: t('avatars.projects'),
      icon: FolderOpen,
      path: "/my-avatars",
      color: "text-cyan-500",
    },
    {
      title: t('store.title'),
      description: t('store.title'),
      icon: Store,
      path: "/store",
      color: "text-cyan-400",
    },
    {
      title: t('tutorials.title'),
      description: t('tutorials.title'),
      icon: BookOpen,
      path: "/tutorials",
      color: "text-cyan-300",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Rotating Banner Carousel */}
        <div
          className="relative overflow-hidden rounded-lg h-64 md:h-80"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slides */}
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {bannerSlides.map((slide) => (
              <div
                key={slide.id}
                className="relative w-full h-full shrink-0"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12">
                  <span className="inline-block px-4 py-1 bg-cyan-500 text-black text-sm font-semibold rounded-full mb-4">
                    {slide.tag}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 max-w-lg">
                    {slide.title}
                  </h2>
                  <p className="text-lg text-gray-200 mb-6 max-w-md">
                    {slide.description}
                  </p>
                  <Button
                    onClick={() => setLocation(slide.link)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-2"
                  >
                    {slide.buttonLabel}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Arrow Navigation */}
          {bannerSlides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {bannerSlides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {bannerSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "w-8 bg-cyan-500"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {!isPaused && bannerSlides.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
              <div
                className="h-full bg-cyan-500 transition-none"
                style={{
                  animation: "progressBar 6s linear infinite",
                }}
              />
              <style>{`
                @keyframes progressBar {
                  from { width: 0%; }
                  to { width: 100%; }
                }
              `}</style>
            </div>
          )}
        </div>

        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('home.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('home.subtitle')}
          </p>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('home.quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.path}
                className="p-6 cursor-pointer hover:ring-2 hover:ring-cyan-500/50 transition-all"
                onClick={() => setLocation(action.path)}
              >
                <action.icon className={`h-8 w-8 ${action.color} mb-3`} />
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Latest News - Press Release Thumbnail */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('blog.latestNews')}</h2>
          <Card
            className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-cyan-500/50 transition-all group"
            onClick={() => setLocation(`/blog/${pressReleasePreview.id}`)}
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative md:w-80 h-48 md:h-auto shrink-0 overflow-hidden">
                <img
                  src={pressReleasePreview.coverImage}
                  alt={pressReleasePreview.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-cyan-500/90 text-black text-xs font-semibold rounded">
                    {pressReleasePreview.category}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {pressReleasePreview.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {pressReleasePreview.location}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-cyan-400 transition-colors">
                    {pressReleasePreview.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {pressReleasePreview.excerpt}
                  </p>
                </div>
                <div className="mt-4">
                  <span className="text-cyan-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t('blog.readMore')} <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
