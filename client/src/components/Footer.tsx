import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="w-full border-t border-border bg-background py-3 px-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
      <span className="opacity-60">{t('footer.copyright')}</span>
      <span className="opacity-30 hidden sm:inline">|</span>
      <Link href="/terms" className="hover:text-foreground transition-colors">
        {t('footer.terms')}
      </Link>
      <span className="opacity-30 hidden sm:inline">|</span>
      <Link href="/privacy" className="hover:text-foreground transition-colors">
        {t('footer.privacy')}
      </Link>
    </footer>
  );
}
