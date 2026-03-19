import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { APP_TITLE } from "@/const";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { realSignIn } from "@/lib/mockTrpc";
import { LoginDialog } from "@/components/LoginDialog";
import {
  LayoutDashboard, Store as StoreIcon,
  BookOpen, Newspaper, HelpCircle, Palette, ExternalLink,
  Sun, Moon, X, Languages, Play, ShoppingCart, Star, Loader2, ArrowLeft, Search
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";

type ActiveView = "home" | "store" | "tutorials" | "blog" | "faq" | "about" | "artists";

const NAV_ICON_DEFS: { icon: React.ElementType; labelKey: string; view?: ActiveView; href?: string }[] = [
  { icon: LayoutDashboard, labelKey: "nav.home",      view: "home" },
  { icon: StoreIcon,       labelKey: "nav.store",     view: "store" },
  { icon: BookOpen,        labelKey: "nav.tutorials", view: "tutorials" },
  { icon: Newspaper,       labelKey: "nav.blog",      view: "blog" },
  { icon: HelpCircle,      labelKey: "nav.faq",       view: "faq" },
  { icon: Palette,         labelKey: "nav.artists",   view: "artists" },
];

// Tile aspect ratios — only square (1:1) or portrait (3:4)
type TileSize = "square" | "portrait";

function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return (h >>> 0) / 0xffffffff;
}

function pickSize(url: string): TileSize {
  // ~35% square, ~65% portrait
  return seededRandom(url) < 0.35 ? "square" : "portrait";
}

// Available languages
const LANGUAGES = [
  { code: "en" as const, label: "English", flag: "🇺🇸" },
  { code: "zh" as const, label: "中文", flag: "🇨🇳" },
];

function LanguageSwitcher({ direction = "right" }: { direction?: "right" | "up" }) {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const selected = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const popoverClass = direction === "up"
    ? "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-36 rounded-xl border border-border bg-background shadow-xl overflow-hidden"
    : "absolute left-12 bottom-0 z-50 w-36 rounded-xl border border-border bg-background shadow-xl overflow-hidden";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        title={`Language: ${selected.label}`}
        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground flex flex-col items-center gap-0.5"
      >
        <span className="text-lg leading-none">{selected.flag}</span>
        <span className="text-[9px] font-semibold leading-none">{selected.code.toUpperCase()}</span>
      </button>

      {open && (
        <div className={popoverClass}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={[
                "w-full text-left px-3 py-2 text-sm transition-colors hover:bg-accent flex items-center gap-2",
                lang.code === selected.code ? "text-primary font-semibold" : "text-foreground",
              ].join(" ")}
            >
              <span className="text-base">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Per-column top offsets — indexed by column count
const OFFSETS_7 = [32, 8, 48, 0, 40, 12, 24];
const OFFSETS_5 = [24, 0, 40, 8, 32];
const OFFSETS_3 = [20, 0, 28];
const OFFSETS_2 = [16, 0];

function ThemeToggle() {
  const { theme, toggleTheme, switchable } = useTheme();
  if (!switchable || !toggleTheme) return null;
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-accent transition-colors"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark"
        ? <Sun  className="h-4 w-4 text-muted-foreground" />
        : <Moon className="h-4 w-4 text-muted-foreground" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------
type LightboxImage = { url: string; name: string } | null;

function Lightbox({ image, onClose }: { image: LightboxImage; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!image) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      style={{ animation: "lbFadeIn 200ms ease" }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative" style={{ animation: "lbZoomIn 250ms cubic-bezier(0.22,1,0.36,1)" }}>
        <img
          src={image.url}
          alt={image.name}
          className="block rounded-xl shadow-2xl"
          style={{ maxWidth: "min(90vw, 1200px)", maxHeight: "90vh", width: "auto", height: "auto" }}
        />
        {image.name && (
          <div className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-black/50 px-4 py-2 text-sm text-white font-medium">
            {image.name}
          </div>
        )}
      </div>

      <style>{`
        @keyframes lbFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes lbZoomIn { from { opacity:0; transform:scale(0.5) } to { opacity:1; transform:scale(1) } }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Responsive hook — returns current column count
// ---------------------------------------------------------------------------
function useColumnCount(): number {
  const [cols, setCols] = useState(() => {
    if (typeof window === "undefined") return 5;
    if (window.innerWidth < 640) return 2;
    if (window.innerWidth < 1024) return 3;
    return 5;
  });

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCols(2);
      else if (window.innerWidth < 1024) setCols(3);
      else setCols(5);
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cols;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Landing() {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) navigate("/");
  }, [isAuthenticated, loading, navigate]);

  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [loginDialogInitialView, setLoginDialogInitialView] = useState<"login" | "signup">("login");

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoginDialogInitialView("login");
    setIsLoginDialogOpen(true);
  };

  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoginDialogInitialView("signup");
    setIsLoginDialogOpen(true);
  };

  const handleLoginSuccess = async (token: string) => {
    await realSignIn(token);
    setIsLoginDialogOpen(false);
    navigate("/");
  };

  const [lightboxImage, setLightboxImage] = useState<LightboxImage>(null);
  const [activeView, setActiveView] = useState<ActiveView>("home");

  const { data: storeData } = trpc.store.listItems.useQuery({});

  const galleryImages = useMemo(() => {
    if (!storeData) return [];
    const imgs: { url: string; name: string }[] = [];
    storeData.forEach(cat => {
      cat.items.forEach(item => {
        if (item.thumbnailUrl) imgs.push({ url: item.thumbnailUrl, name: item.name });
        if (item.image2Url)    imgs.push({ url: item.image2Url,    name: item.name });
        if (item.image3Url)    imgs.push({ url: item.image3Url,    name: item.name });
        if (item.image4Url)    imgs.push({ url: item.image4Url,    name: item.name });
      });
    });
    // Fisher-Yates shuffle
    for (let i = imgs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
    }
    return imgs;
  }, [storeData]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar — hidden on mobile (< sm) */}
        <aside className="hidden sm:flex flex-col items-center w-14 bg-background border-r border-border py-3 gap-1 shrink-0 z-20">
          <div className="mb-3 mt-1">
            <button
              onClick={() => setActiveView("about")}
              title="About Genji"
              className="rounded-md hover:opacity-80 transition-opacity focus:outline-none"
            >
              <img
                src="/assets/images/reblium-hero.png"
                className="h-8 w-8 rounded-md object-contain dark:invert"
                alt="Genji Logo"
              />
            </button>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            {NAV_ICON_DEFS.map(({ icon: Icon, labelKey, view, href }) => (
              <button
                key={labelKey}
                title={t(labelKey)}
                onClick={() => href ? navigate(href) : view && setActiveView(view)}
                className={[
                  "p-2 rounded-lg transition-colors cursor-pointer",
                  activeView === view
                    ? "bg-accent text-foreground"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center gap-1 mb-1">
            <LanguageSwitcher direction="right" />
            <ThemeToggle />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto pb-16 sm:pb-0">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-background/80 backdrop-blur-sm border-b border-border">
            {/* Logo visible only on mobile */}
            <div className="flex items-center gap-2">
              <img
                src="/assets/images/reblium-hero.png"
                className="h-6 w-6 rounded object-contain dark:invert sm:hidden"
                alt="Logo"
              />
              <span className="text-sm font-semibold tracking-tight text-foreground">{APP_TITLE}</span>
            </div>
            <a href="#" onClick={handleSignIn} className="text-sm text-primary hover:underline font-medium">{t('landing.signIn')}</a>
          </div>

          {activeView === "about" && <LandingAboutPanel onStart={() => setActiveView("store")} />}
          {activeView === "store" && <LandingStorePanel onSignIn={handleSignIn} />}
          {activeView === "tutorials" && <LandingTutorialsPanel />}
          {activeView === "blog" && <LandingBlogPanel />}
          {activeView === "faq" && <LandingFAQPanel />}
          {activeView === "artists" && <LandingArtistsPanel onSignIn={handleSignIn} />}
          {activeView === "home" && (
            <div className="flex flex-col">
              {/* Hero text block */}
              <div className="text-center px-6 pt-10 pb-8 space-y-4">
                <h1 className="font-black tracking-tight leading-tight text-foreground">
                  <span className="text-8xl sm:text-9xl lg:text-[10rem] block uppercase">{t('hero.headline')}</span>
                  <span className="text-4xl sm:text-5xl lg:text-6xl text-primary block -mt-2">{t('hero.subheadline')}</span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                  {t('hero.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => setActiveView("store")}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-all shadow-lg shadow-primary/25"
                  >
                    {t('hero.browseCharacters')}
                  </button>
                  <button
                    onClick={() => setActiveView("about")}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl border border-border hover:border-foreground/30 text-foreground font-semibold text-sm transition-all bg-muted/40 hover:bg-muted"
                  >
                    {t('hero.learnMore')}
                  </button>
                </div>
              </div>
              {/* Gallery */}
              {galleryImages.length === 0
                ? <SkeletonColumns />
                : <StaggeredGallery
                    images={galleryImages}
                    onSignIn={handleSignIn}
                    onSignUp={handleSignUp}
                    onTileClick={setLightboxImage}
                  />
              }
            </div>
          )}
          <Footer />
        </main>
      </div>

      {/* Mobile bottom nav — visible only on mobile (< sm) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around bg-background/95 backdrop-blur-md border-t border-border px-2 py-2">
        {NAV_ICON_DEFS.map(({ icon: Icon, labelKey, view, href }) => (
          <button
            key={labelKey}
            title={t(labelKey)}
            onClick={() => href ? navigate(href) : view && setActiveView(view)}
            className={[
              "flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors cursor-pointer",
              activeView === view
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[9px] font-medium leading-none">{t(labelKey)}</span>
          </button>
        ))}
        <LanguageSwitcher direction="up" />
        <ThemeToggle />
      </nav>

      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        onLoginSuccess={handleLoginSuccess}
        initialView={loginDialogInitialView}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
function SkeletonColumns() {
  const numCols = useColumnCount();
  const offsets = numCols === 7 ? OFFSETS_7 : numCols === 5 ? OFFSETS_5 : numCols === 3 ? OFFSETS_3 : OFFSETS_2;

  return (
    <div className="flex gap-2 sm:gap-3 px-2 sm:px-3 pt-3 pb-4">
      {offsets.map((offset, ci) => (
        <div key={ci} className="flex-1 flex flex-col gap-2 sm:gap-3" style={{ marginTop: offset }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`rounded-xl bg-muted animate-pulse ${i % 2 === 0 ? "h-48 sm:h-64" : "h-32 sm:h-40"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Staggered gallery — responsive column count
// ---------------------------------------------------------------------------
type GalleryImage = { url: string; name: string };

function StaggeredGallery({
  images,
  onSignIn,
  onSignUp,
  onTileClick,
}: {
  images: GalleryImage[];
  onSignIn: (e: React.MouseEvent) => void;
  onSignUp: (e: React.MouseEvent) => void;
  onTileClick: (img: GalleryImage) => void;
}) {
  const numCols = useColumnCount(); // 2 / 3 / 5 based on screen width

  // Track which (colIdx, tileIdx) is hovered — for Dock-style magnification
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const offsets = numCols === 7 ? OFFSETS_7 : numCols === 5 ? OFFSETS_5 : numCols === 3 ? OFFSETS_3 : OFFSETS_2;

  const columns = useMemo(() => {
    const cols: Array<Array<{ kind: "image"; img: GalleryImage } | { kind: "login" }>> =
      Array.from({ length: numCols }, () => []);

    let colIdx = 0;
    let loginInserted = false;

    images.forEach((img) => {
      if (!loginInserted && colIdx === 1 && cols[1].length === 2) {
        cols[1].push({ kind: "login" });
        loginInserted = true;
      }
      cols[colIdx].push({ kind: "image", img });
      colIdx = (colIdx + 1) % numCols;
    });

    if (!loginInserted) cols[Math.min(1, numCols - 1)].push({ kind: "login" });
    return cols;
  }, [images, numCols]);

  // -------------------------------------------------------------------------
  // Hover strategy:
  //
  // The hovered tile scales to 2x visually (transform:scale) and floats above
  // everything via z-index. Its layout footprint stays the same.
  //
  // To fill the space the scaled tile now visually occupies:
  //   - Tile directly ABOVE: grows its height by the vertical overflow amount
  //   - Tile directly BELOW: grows its height by the vertical overflow amount
  //   - Adjacent columns: grow their flex to fill horizontal overflow
  //
  // This means NO empty gaps — neighbours expand INTO the space behind the
  // floating scaled tile, filling it completely.
  // -------------------------------------------------------------------------

  const SCALE = 1.5;
  const SPRING = "300ms cubic-bezier(0.22, 1.4, 0.36, 1)";

  // Measure hovered tile width for horizontal overflow calculation
  const hoveredRef = useRef<HTMLDivElement | null>(null);
  const [hoveredW, setHoveredW] = useState(0);
  useEffect(() => {
    if (hoveredRef.current) setHoveredW(hoveredRef.current.offsetWidth);
    else setHoveredW(0);
  }, [hoveredKey]);

  // Aspect ratio per size: square = 1/1, portrait = 3/4
  const ASPECT: Record<TileSize, string> = { square: "1 / 1", portrait: "3 / 4" };

  const getTileStyle = (
    colIdx: number,
    tileIdx: number,
    size: TileSize,
    _isHov: boolean
  ): React.CSSProperties => {
    const aspectRatio = ASPECT[size];
    const transition = `transform ${SPRING}, margin ${SPRING}, box-shadow 300ms ease`;

    if (!hoveredKey) return { aspectRatio, transition };

    const [hc, ht] = hoveredKey.split("-").map(Number);
    const dc = colIdx - hc;
    const dr = tileIdx - ht;

    // Hovered tile: scale up visually, float on top
    if (dc === 0 && dr === 0) {
      return {
        aspectRatio,
        transform: `scale(${SCALE})`,
        zIndex: 30,
        boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
        transition,
      };
    }

    // Same column, tile directly ABOVE: scale down slightly
    if (dc === 0 && dr === -1) {
      return { aspectRatio, transform: "scale(0.93)", zIndex: 2, transition };
    }

    // Same column, tile directly BELOW: scale down slightly
    if (dc === 0 && dr === 1) {
      return { aspectRatio, transform: "scale(0.93)", zIndex: 2, transition };
    }

    // Tiles 2 rows away in same column: subtle scale down
    if (dc === 0 && Math.abs(dr) === 2) {
      return { aspectRatio, transform: "scale(0.97)", transition };
    }

    return { aspectRatio, transition };
  };

  // Adjacent columns grow their flex to fill horizontal overflow of the scaled tile
  const getColumnStyle = (colIdx: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      marginTop: offsets[colIdx],
      transition: `flex ${SPRING}, margin ${SPRING}`,
    };
    if (!hoveredKey) return base;
    const [hc] = hoveredKey.split("-").map(Number);
    const dc = colIdx - hc;
    const w = hoveredW || 120;
    // How much the scaled tile overflows horizontally on each side
    const hOverflow = w * (SCALE - 1) / 2;
    // Grow adjacent columns by the overflow amount so they fill the space
    if (dc === 1 || dc === -1) {
      return { ...base, flex: `1 1 ${hOverflow}px` };
    }
    return base;
  };

  return (
    <div
      className="flex gap-3 sm:gap-4 px-3 sm:px-4 pt-3 pb-4"
      style={{ transition: `gap ${SPRING}` }}
    >
      {columns.map((col, ci) => (
        <div
          key={ci}
          className="flex flex-col gap-3 sm:gap-4 overflow-visible"
          style={{
            ...getColumnStyle(ci),
            flex: "1 1 0",
            minWidth: 0,
            transition: `flex ${SPRING}, margin ${SPRING}, opacity ${SPRING}`,
          }}
        >
          {col.map((item, ti) => {
            if (item.kind === "login") {
              return (
                <div key="login" className="rounded-xl overflow-hidden">
                  <LoginCard onSignIn={onSignIn} onSignUp={onSignUp} />
                </div>
              );
            }

            const size = pickSize(item.img.url);
            const isHovered = hoveredKey === `${ci}-${ti}`;
            const tileStyle = getTileStyle(ci, ti, size, isHovered);

            return (
              <GalleryTile
                key={ti}
                ref={isHovered ? hoveredRef : null}
                img={item.img}
                size={size}
                tileStyle={tileStyle}
                isHovered={isHovered}
                onHoverStart={() => setHoveredKey(`${ci}-${ti}`)}
                onHoverEnd={() => setHoveredKey(null)}
                onClick={() => onTileClick(item.img)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tile
// ---------------------------------------------------------------------------
const GalleryTile = React.forwardRef<HTMLDivElement, {
  img: GalleryImage;
  size: TileSize;
  tileStyle?: React.CSSProperties;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}>(function GalleryTile({
  img,
  size,
  tileStyle = {},
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick,
}, ref) {
  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="relative cursor-zoom-in rounded-xl bg-muted w-full overflow-hidden"
      style={{
        willChange: "transform, margin",
        ...tileStyle,
      }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <img
          src={img.url}
          alt={img.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).closest('div')!.style.display = "none";
          }}
        />
      </div>
      {/* Item name label — fades in on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent pointer-events-none rounded-b-xl"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      >
        <p className="text-white text-[11px] font-semibold leading-tight truncate drop-shadow">
          {img.name}
        </p>
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Login card
// ---------------------------------------------------------------------------
function LoginCard({ onSignIn, onSignUp }: { onSignIn: (e: React.MouseEvent) => void; onSignUp: (e: React.MouseEvent) => void }) {
  const { t } = useLanguage();
  return (
    <div className="rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-lg p-4 sm:p-5 flex flex-col justify-center gap-3">
      <div className="flex items-center gap-2 mb-1">
        <img
          src="/assets/images/reblium-hero.png"
          className="h-6 w-6 rounded object-contain dark:invert"
          alt="Genji Logo"
        />
        <span className="font-semibold text-sm text-foreground">{t('landing.signInDesc')}</span>
      </div>

      {/* WeChat login */}
      <a href="#" onClick={onSignIn}
        className="flex items-center justify-center gap-2 w-full rounded-lg border border-border bg-[#07C160] hover:bg-[#06ad55] transition-colors px-4 py-2.5 text-sm font-semibold text-white">
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-3.74 2.632c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm5.4 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
        </svg>
        {t('common.signIn')}
      </a>

      <div className="text-center text-xs text-muted-foreground mt-1">
        <a href="#" onClick={onSignUp} className="text-primary hover:underline font-medium">{t('common.signUp')}</a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline Store Panel (no DashboardLayout wrapper)
// ---------------------------------------------------------------------------
const STORE_CATEGORY_LABELS: Record<string, string> = {
  clothing: "Clothing",
  fantasy: "Fantasy",
  "sci-fi": "Sci-Fi",
};

function LandingStorePanel({ onSignIn }: { onSignIn: (e: React.MouseEvent) => void }) {
  const storeItemsQuery = trpc.store.listItems.useQuery({});
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { t } = useLanguage();

  const allItems = useMemo(() => {
    if (!storeItemsQuery.data) return [];
    return storeItemsQuery.data.flatMap((cat: any) => cat.items);
  }, [storeItemsQuery.data]);

  const categories = useMemo(() => {
    if (!storeItemsQuery.data) return [];
    return storeItemsQuery.data.map((cat: any) => cat.name.toLowerCase());
  }, [storeItemsQuery.data]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item: any) => {
      const matchesCategory = !activeCategory || item.category?.toLowerCase() === activeCategory;
      const matchesSearch = !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allItems, activeCategory, searchQuery]);

  if (storeItemsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-foreground">{t('store.title')}</h1>
        <a href="#" onClick={onSignIn} className="text-sm text-primary hover:underline font-medium">{t('landing.signIn')}</a>
      </div>

      {/* Search + category filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            placeholder={t('common.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full h-9 rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
              activeCategory === null
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground",
            ].join(" ")}
          >
            {t('common.all')}
          </button>
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={[
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                activeCategory === cat
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground",
              ].join(" ")}
            >
              {STORE_CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filteredItems.length} {filteredItems.length === 1 ? t('collection.asset') : t('collection.assets')} found
      </p>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredItems.map((item: any) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl cursor-pointer bg-muted aspect-[3/4]"
              onClick={() => setLocation(`/product/${item.id}`)}
            >
              <img
                src={item.thumbnailUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/50 text-white/90 backdrop-blur-sm">
                  {STORE_CATEGORY_LABELS[item.category?.toLowerCase() ?? ""] ?? item.category}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">{item.name}</p>
                <p className="text-cyan-300 text-xs font-medium">${item.personalPriceUSD} / ¥{item.personalPriceCNY}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); onSignIn(e); }}
                  className="mt-2 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs py-1 h-7 rounded-md flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-3 h-3" />{t('common.addToCart')}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
          <Search className="w-10 h-10 opacity-30" />
          <p className="text-lg font-medium">{t('common.noResults')}</p>
          <p className="text-sm">{t('common.noResultsHint')}</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline Tutorials Panel (no DashboardLayout wrapper)
// ---------------------------------------------------------------------------
const TUTORIAL_VIDEOS = [
  { title: "Tutorial 1", embedId: "l1EWoGhW5OM", url: "https://youtu.be/l1EWoGhW5OM" },
  { title: "Tutorial 2", embedId: "qnXMG_Bth08", url: "https://www.youtube.com/watch?v=qnXMG_Bth08" },
  { title: "Tutorial 3", embedId: "fmIBBj_WbIA", url: "https://youtu.be/fmIBBj_WbIA" },
  { title: "Tutorial 4", embedId: "dNEkHeq8lLY", url: "https://youtu.be/dNEkHeq8lLY" },
  { title: "Tutorial 5", embedId: "HNk1e8DXXBQ", url: "https://youtu.be/HNk1e8DXXBQ" },
  { title: "Tutorial 6", embedId: "tH2vzZwLksw", url: "https://www.youtube.com/watch?v=tH2vzZwLksw" },
];

const SHOWCASE_VIDEOS = [
  { title: "Showcase", embedId: "3is2LjVvd4Y", url: "https://www.youtube.com/watch?v=3is2LjVvd4Y" },
];

const GENJI_TUTORIAL_DEFS = [
  {
    titleKey: "tutorialsPanel.intro",
    thumbnail: "/assets/images/fantasy-1.jpg",
    duration: "10 min",
  },
  {
    titleKey: "tutorialsPanel.exportUnity",
    thumbnail: "/assets/images/darklady.jpg",
    duration: "8 min",
  },
  {
    titleKey: "tutorialsPanel.exportUnreal",
    thumbnail: "/assets/images/femaleknight.jpg",
    duration: "8 min",
  },
];

function LandingTutorialsPanel() {
  const { t } = useLanguage();
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('tutorialsPanel.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('tutorialsPanel.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {GENJI_TUTORIAL_DEFS.map((video) => (
          <div key={video.titleKey} className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all">
            {/* Thumbnail with Coming Soon overlay */}
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img
                src={video.thumbnail}
                alt={t(video.titleKey)}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              {/* Play button (default) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-0 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <Play className="h-6 w-6 text-white fill-white ml-1" />
                </div>
              </div>
              {/* Coming Soon overlay on hover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-bold text-xl tracking-wide">{t('tutorialsPanel.comingSoon')}</span>
                <span className="text-white/70 text-sm mt-1">{t('tutorialsPanel.comingSoonDesc')}</span>
              </div>
            </div>
            {/* Title */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground text-base leading-snug">{t(video.titleKey)}</h3>
              <p className="text-muted-foreground text-xs mt-1">{video.duration} &middot; Genji Studio</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline Blog Panel
// ---------------------------------------------------------------------------
const BLOG_ARTICLE_DEFS = [
  {
    id: "genji-launch",
    titleKey: "blog.genjiTitle",
    subtitleKey: "blog.genjiSubtitle",
    dateKey: "blog.genjiDate",
    categoryKey: "blog.pressRelease",
    coverImage: "/assets/images/reblium-hero.png",
    excerptKey: "blog.genjiExcerpt",
  },
];

function LandingBlogPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const { t } = useLanguage();
  const article = BLOG_ARTICLE_DEFS.find(a => a.id === selected);

  if (article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t('blog.backToBlog')}
        </button>
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t(article.categoryKey)}</span>
            <h1 className="text-3xl font-bold text-foreground">{t(article.titleKey)}</h1>
            <p className="text-muted-foreground">{t(article.subtitleKey)}</p>
            <p className="text-xs text-muted-foreground">{t(article.dateKey)}</p>
          </div>
          <img src={article.coverImage} alt={t(article.titleKey)} className="w-full rounded-xl object-cover aspect-video" />
          <p className="text-foreground leading-relaxed">{t(article.excerptKey)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('blog.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('blog.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {BLOG_ARTICLE_DEFS.map((a) => (
          <Card
            key={a.id}
            className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
            onClick={() => setSelected(a.id)}
          >
            <img src={a.coverImage} alt={t(a.titleKey)} className="w-full aspect-video object-cover" />
            <div className="p-4 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t(a.categoryKey)}</span>
              <h3 className="font-semibold text-foreground leading-snug">{t(a.titleKey)}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{t(a.excerptKey)}</p>
              <p className="text-xs text-muted-foreground pt-1">{t(a.dateKey)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline FAQ Panel
// ---------------------------------------------------------------------------
const FAQ_DEV_KEYS = [
  { qKey: "landing.faq.q1", aKey: "landing.faq.a1" },
  { qKey: "landing.faq.q2", aKey: "landing.faq.a2" },
  { qKey: "landing.faq.q3", aKey: "landing.faq.a3" },
  { qKey: "landing.faq.q4", aKey: "landing.faq.a4" },
];

const FAQ_ARTIST_KEYS = [
  { qKey: "landing.faq.q5", aKey: "landing.faq.a5" },
  { qKey: "landing.faq.q6", aKey: "landing.faq.a6" },
  { qKey: "landing.faq.q7", aKey: "landing.faq.a7" },
  { qKey: "landing.faq.q8", aKey: "landing.faq.a8" },
];

function FAQItem({ qKey, aKey }: { qKey: string; aKey: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span>{t(qKey)}</span>
        <span className={`ml-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground border-t border-border bg-muted/30">
          {t(aKey)}
        </div>
      )}
    </div>
  );
}

function LandingFAQPanel() {
  const [tab, setTab] = useState<"dev" | "artist">("dev");
  const { t } = useLanguage();
  const items = tab === "dev" ? FAQ_DEV_KEYS : FAQ_ARTIST_KEYS;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('landing.faq.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('landing.faq.subtitle')}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setTab("dev")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === "dev" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
        >
          {t('landing.faq.devTab')}
        </button>
        <button
          onClick={() => setTab("artist")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === "artist" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
        >
          {t('landing.faq.artistTab')}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => <FAQItem key={i} qKey={item.qKey} aKey={item.aKey} />)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product Landing Panel — shown when user clicks the logo
// ---------------------------------------------------------------------------
const ARTWORK = [
  "/assets/images/gallery-darklady.jpg",
  "/assets/images/gallery-demon.jpg",
  "/assets/images/gallery-femaleknight.jpg",
  "/assets/images/gallery-catwoman.jpg",
  "/assets/images/gallery-ninjagirl.jpg",
  "/assets/images/gallery-scifi.jpg",
  "/assets/images/gallery-mech.jpg",
  "/assets/images/gallery-dracula.jpg",
];

function LandingAboutPanel({ onStart }: { onStart: () => void }) {
  const { data: storeData } = trpc.store.listItems.useQuery({});
  const { t } = useLanguage();
  const artImages: string[] = (() => {
    if (!storeData) return ARTWORK;
    const allItems = (storeData as Array<{ name: string; items: Array<{ thumbnailUrl: string }> }>)
      .flatMap(cat => cat.items)
      .slice(0, 8)
      .map(item => item.thumbnailUrl)
      .filter(Boolean);
    return allItems.length > 0 ? allItems : ARTWORK;
  })();

  return (
    <div className="bg-background text-foreground overflow-y-auto">

      {/* ── SECTION 1: Hero ── */}
      <section className="relative flex flex-col items-center justify-start overflow-hidden px-6 py-16">
        {/* Top: badge + headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-8">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none">
            <span className="text-primary">{t('landing.about.heroHeadlineAccent')}</span>
          </h1>
        </div>

        {/* Middle: Autoplay video */}
        <div className="w-full flex justify-center mb-8">
          <video
            src="/assets/images/reblium-hero.png"
            autoPlay
            muted
            loop
            playsInline
            className="w-1/2 rounded-2xl object-cover shadow-2xl"
          />
        </div>

        {/* Bottom: subtext + CTAs */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {t('landing.about.heroSubtitle')}<br />
            <span className="text-muted-foreground">{t('landing.about.heroSubtitle2')}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onStart}
              className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base transition-all shadow-lg shadow-primary/30"
            >
              {t('landing.about.startBuilding')}
            </button>
            <button
              onClick={onStart}
              className="px-8 py-3 rounded-xl border border-border hover:border-foreground/40 text-foreground font-semibold text-base transition-all bg-muted/50 hover:bg-muted"
            >
              {t('landing.about.viewCharacters')}
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Value Proposition ── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black leading-tight">
              {t('landing.about.s2Title')}<br />
              <span className="text-primary">{t('landing.about.s2TitleAccent')}</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t('landing.about.s2Body')}
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">{t('landing.about.s2ListIntro')}</p>
            <ul className="space-y-3">
              {(['landing.about.s2Feature1','landing.about.s2Feature2','landing.about.s2Feature3','landing.about.s2Feature4','landing.about.s2Feature5'] as const).map((key) => (
                <li key={key} className="flex items-center gap-3 text-foreground">
                  <span className="h-5 w-5 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-xs">✓</span>
                  {t(key)}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-sm">{t('landing.about.s2Footer')}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
          {artImages.slice(0, 4).map((url: string, i: number) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-border aspect-[3/4]">
              <img src={url} alt="" className="w-full h-full object-cover object-top" />
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: How it works ── */}
      <section className="px-6 py-24 bg-muted/20">
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-black">{t('landing.about.s3Title')}</h2>
          <p className="text-muted-foreground text-lg">{t('landing.about.s3Subtitle')}</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "01", titleKey: "landing.about.s3Step1Title", descKey: "landing.about.s3Step1Desc", img: artImages[0] },
            { step: "02", titleKey: "landing.about.s3Step2Title", descKey: "landing.about.s3Step2Desc", img: artImages[2] },
            { step: "03", titleKey: "landing.about.s3Step3Title", descKey: "landing.about.s3Step3Desc", img: artImages[5] },
          ].map(({ step, titleKey, descKey, img }) => (
            <div key={step} className="rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/40 transition-all">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={img} alt={t(titleKey)} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-xs font-bold text-primary tracking-widest">STEP {step}</span>
                <h3 className="text-lg font-bold">{t(titleKey)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: Key Feature ── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-3 order-2 lg:order-1">
          {artImages.slice(4, 8).map((url: string, i: number) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-border aspect-[3/4]">
              <img src={url} alt="" className="w-full h-full object-cover object-top" />
            </div>
          ))}
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-4xl sm:text-5xl font-black leading-tight">
              {t('landing.about.s4Title')}<br />
              <span className="text-primary">{t('landing.about.s4TitleAccent')}</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t('landing.about.s4Body1')}
            </p>
            <p className="text-foreground leading-relaxed">
              {t('landing.about.s4Body2')}
            </p>
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
              <p className="text-primary font-semibold text-lg">{t('landing.about.s4Highlight')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Game Engine Ready ── */}
      <section className="px-6 py-24 bg-muted/20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black leading-tight">
              {t('landing.about.s5Title')}<br />
              <span className="text-primary">{t('landing.about.s5TitleAccent')}</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t('landing.about.s5Body')}
            </p>
            <ul className="space-y-3">
              {(['landing.about.s5Feature1','landing.about.s5Feature2','landing.about.s5Feature3','landing.about.s5Feature4'] as const).map((key) => (
                <li key={key} className="flex items-center gap-3 text-foreground">
                  <span className="h-5 w-5 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-xs">→</span>
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Unity", "Unreal", "Blender", "Maya", "GLTF", "Web"].map((tool) => (
              <div key={tool} className="rounded-xl border border-border bg-card p-4 text-center hover:border-primary/40 transition-all">
                <p className="text-sm font-semibold text-foreground">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: Rendering Technology ── */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-black">{t('landing.about.s6Title')}<br />{t('landing.about.s6TitleAccent')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('landing.about.s6Body')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { titleKey: "landing.about.s6Card1Title", descKey: "landing.about.s6Card1Desc" },
            { titleKey: "landing.about.s6Card2Title", descKey: "landing.about.s6Card2Desc" },
            { titleKey: "landing.about.s6Card3Title", descKey: "landing.about.s6Card3Desc" },
            { titleKey: "landing.about.s6Card4Title", descKey: "landing.about.s6Card4Desc" },
          ].map(({ titleKey, descKey }) => (
            <div key={titleKey} className="rounded-2xl border border-border bg-card p-5 space-y-2 hover:border-primary/30 transition-all">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-3">
                <span className="text-primary text-sm">⬡</span>
              </div>
              <h3 className="font-bold text-foreground">{t(titleKey)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: CTA ── */}
      <section className="px-6 py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-6xl font-black leading-tight">
            {t('landing.about.s7Title')}<br />
            <span className="text-primary">{t('landing.about.s7TitleAccent')}</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStart}
              className="px-10 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg transition-all shadow-lg shadow-primary/30"
            >
              {t('landing.about.startBuilding')}
            </button>
            <button
              onClick={onStart}
              className="px-10 py-4 rounded-xl border border-border hover:border-foreground/40 text-foreground font-semibold text-lg transition-all bg-muted/50 hover:bg-muted"
            >
              {t('landing.about.browseCharacters')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border text-center text-muted-foreground text-sm">
        {t('footer.copyright')}
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Artists Panel (pre-login)
// ---------------------------------------------------------------------------
const andre = {
  name: "Andre Ferwerda",
  titleKey: "artists.residentArtist",
  website: "https://andreferwerda.com/",
  bioKey: "artists.andreBio",
  image: "/assets/images/artist-andre.jpg",
};

function LandingArtistsPanel({ onSignIn }: { onSignIn: (e: React.MouseEvent) => void }) {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const storeItemsQuery = trpc.store.listItems.useQuery({});
  const allItems = storeItemsQuery.data?.flatMap(cat => cat.items) || [];

  return (
    <div className="px-4 sm:px-8 py-10 space-y-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">{t('artists.title')}</h1>
        <p className="text-muted-foreground mt-2 text-lg">{t('artists.subtitle')}</p>
      </div>

      {/* Featured Artist */}
      <div className="bg-card rounded-lg p-8 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex justify-center">
            <img
              src={andre.image}
              alt={andre.name}
              className="rounded-full w-48 h-48 object-cover border-4 border-cyan-500/30"
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold mb-3">
                {t(andre.titleKey)}
              </span>
              <h2 className="text-3xl font-bold text-foreground">{andre.name}</h2>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">{t(andre.bioKey)}</p>
            <div className="flex gap-3 pt-4">
              <a
                href={andre.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-sm transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                {t('artists.visitPortfolio')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Artist's Store Items */}
      <div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          {andre.name}{t('artists.collection')}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t('artists.collectionDesc').replace('{count}', String(allItems.length)).replace('{name}', andre.name)}
        </p>

        {storeItemsQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allItems.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl bg-card border border-border cursor-pointer hover:ring-2 hover:ring-cyan-500 transition-all"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-card-foreground mb-1 line-clamp-2">
                    {language === 'zh' && item.nameCn ? item.nameCn : item.name}
                  </h3>
                  <p className="text-xs text-cyan-400/70 mb-2">{t('artists.by')} {andre.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cyan-400 font-semibold">
                      ${item.personalPriceUSD} / ¥{item.personalPriceCNY}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-foreground">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA for unauthenticated users */}
        <div className="mt-10 text-center py-10 border border-dashed border-border rounded-xl bg-muted/20">
          <p className="text-muted-foreground mb-4">{t('artists.signInToAccess') || 'Sign in to purchase assets and access your collection'}</p>
          <a
            href="#"
            onClick={onSignIn}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-sm transition-colors"
          >
            {t('landing.signIn')}
          </a>
        </div>
      </div>
    </div>
  );
}
