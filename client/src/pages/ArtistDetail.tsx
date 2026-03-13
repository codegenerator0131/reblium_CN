import DashboardLayout from "@/components/DashboardLayout";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Star } from 'lucide-react';
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const andre = {
  id: "andre-ferwerda",
  name: "Andre Ferwerda",
  titleKey: "artists.residentArtist",
  bioKey: "artists.andreBio",
  image: "/assets/images/artist-andre.jpg",
  website: "https://andreferwerda.com/",
  specialtiesKeys: [
    "artists.specialty1",
    "artists.specialty2",
    "artists.specialty3",
    "artists.specialty4",
    "artists.specialty5",
  ],
};

export default function ArtistDetail() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const storeItemsQuery = trpc.store.listItems.useQuery({});

  const allItems = storeItemsQuery.data?.flatMap(cat => cat.items) || [];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-10">
        {/* Back Button */}
        <div>
          <Link href="/artists">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              {t('artists.backToArtists')}
            </Button>
          </Link>
        </div>

        {/* Artist Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Artist Image */}
          <div className="md:col-span-1 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
              <img
                src={andre.image}
                alt={andre.name}
                className="relative w-48 h-48 rounded-full object-cover border-4 border-cyan-500/30"
              />
            </div>
          </div>

          {/* Artist Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold mb-3">
                {t(andre.titleKey)}
              </span>
              <h1 className="text-4xl font-bold text-foreground">{andre.name}</h1>
            </div>

            <p className="text-muted-foreground text-base leading-relaxed">{t(andre.bioKey)}</p>

            {/* Specialties */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t('artists.specialties')}</h3>
              <div className="flex flex-wrap gap-2">
                {andre.specialtiesKeys.map(key => (
                  <span
                    key={key}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                  >
                    {t(key)}
                  </span>
                ))}
              </div>
            </div>

            {/* Links & Stats */}
            <div className="flex items-center gap-4 pt-4">
              <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                <a
                  href={andre.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {t('artists.visitPortfolio')}
                </a>
              </Button>
              <span className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{allItems.length}</span> {t('artists.assetsInStore')}
              </span>
            </div>
          </div>
        </div>

        {/* All Store Items */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">{t('artists.allCreations')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('artists.browseAll').replace('{count}', String(allItems.length)).replace('{name}', andre.name)}
          </p>

          {storeItemsQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden bg-card border-border cursor-pointer hover:ring-2 hover:ring-cyan-500 transition-all"
                  onClick={() => setLocation(`/product/${item.id}`)}
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-card-foreground mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-cyan-400/70 mb-2">{t('artists.by')} {andre.name}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm text-cyan-400 font-semibold">
                          ${item.personalPriceUSD} / ¥{item.personalPriceCNY}
                        </span>
                        <span className="text-xs text-muted-foreground">{t('store.personal')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-foreground">4.8</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
