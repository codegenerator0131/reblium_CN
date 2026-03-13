import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, ExternalLink, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

interface BlogArticle {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  category: string;
  coverImage: string;
  excerpt: string;
  content: string[];
  sections: {
    title: string;
    content: string;
    bullets?: string[];
  }[];
}

function useArticles(): BlogArticle[] {
  const { t } = useLanguage();
  return [
    {
      id: "genji-launch",
      title: t('blog.genjiTitle'),
      subtitle: t('blog.genjiSubtitle'),
      date: t('blog.genjiDate'),
      location: t('blog.genjiLocation'),
      category: t('blog.pressRelease'),
      coverImage: "/assets/images/banner-genji.png",
      excerpt: t('blog.genjiExcerpt'),
      content: [
        t('blog.genjiContent1'),
        t('blog.genjiContent2'),
        t('blog.genjiContent3'),
      ],
      sections: [
        {
          title: t('blog.genjiSection1Title'),
          content: t('blog.genjiSection1Content'),
          bullets: [
            t('blog.genjiSection1Bullet1'),
            t('blog.genjiSection1Bullet2'),
            t('blog.genjiSection1Bullet3'),
            t('blog.genjiSection1Bullet4'),
            t('blog.genjiSection1Bullet5'),
          ],
        },
        {
          title: t('blog.genjiSection2Title'),
          content: t('blog.genjiSection2Content'),
        },
        {
          title: t('blog.genjiSection3Title'),
          content: t('blog.genjiSection3Content'),
        },
        {
          title: t('blog.genjiSection4Title'),
          content: t('blog.genjiSection4Content'),
        },
      ],
    },
  ];
}

export default function Blog() {
  const params = useParams<{ articleId?: string }>();
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const articles = useArticles();
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  // Auto-expand article if articleId is in the URL
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (params.articleId) {
      const found = articles.find((a) => a.id === params.articleId);
      if (found) {
        setSelectedArticle(found);
      }
    } else {
      setSelectedArticle(null);
    }
  }, [params.articleId, language]);

  const handleBack = () => {
    setSelectedArticle(null);
    setLocation("/blog");
  };

  const handleSelectArticle = (article: BlogArticle) => {
    setSelectedArticle(article);
    setLocation(`/blog/${article.id}`);
  };

  if (selectedArticle) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-foreground"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('blog.backToBlog')}
          </Button>

          {/* Article header */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">
              {selectedArticle.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {selectedArticle.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {selectedArticle.subtitle}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {selectedArticle.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {selectedArticle.location}
              </span>
            </div>
          </div>

          {/* Article content */}
          <div className="space-y-6">
            {selectedArticle.content.map((paragraph, idx) => (
              <p key={idx} className="text-foreground/90 leading-relaxed text-base">
                {paragraph}
              </p>
            ))}

            <hr className="border-border my-8" />

            {selectedArticle.sections.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {section.title}
                </h2>
                {section.content.split("\n\n").map((para, pIdx) => (
                  <p key={pIdx} className="text-foreground/90 leading-relaxed text-base mb-4">
                    {para}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 space-y-2 ml-4">
                    {section.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-foreground/90">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <hr className="border-border my-8" />

            {/* Media Contact */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3">{t('blog.mediaContact')}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Reblika Software B.V.</p>
                <p>Schiedamse Vest 154</p>
                <p>3011 BH Rotterdam</p>
                <p>Netherlands</p>
                <a href="mailto:press@reblika.com" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-2">
                  press@reblika.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('blog.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('blog.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-cyan-500/50 transition-all group"
              onClick={() => handleSelectArticle(article)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-cyan-500/90 text-black text-xs font-semibold rounded">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {article.location}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <span className="text-cyan-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t('blog.readMore')} <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
