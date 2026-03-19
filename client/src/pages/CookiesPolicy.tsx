import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";

export function CookiesPolicy() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t('legal.cookiesTitle')}</h1>
        
        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('legal.cookiesSection1Title')}</h2>
            <p className="mb-4">{t('legal.cookiesSection1Content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('legal.cookiesSection2Title')}</h2>
            <p className="mb-4">{t('legal.cookiesSection2Content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('legal.cookiesSection3Title')}</h2>
            <p className="mb-4">{t('legal.cookiesSection3Content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('legal.cookiesSection4Title')}</h2>
            <p className="mb-4">{t('legal.cookiesSection4Content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('legal.cookiesSection5Title')}</h2>
            <p className="mb-4">{t('legal.cookiesSection5Content')}</p>
          </section>

          <section className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">{t('legal.lastUpdated')}</p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
