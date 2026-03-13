import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Code2, Palette } from "lucide-react";

export function FAQ() {
  const { t } = useLanguage();

  const developerFAQ = [
    { question: t('landing.faq.q1'), answer: t('landing.faq.a1') },
    { question: t('landing.faq.q2'), answer: t('landing.faq.a2') },
    { question: t('landing.faq.q3'), answer: t('landing.faq.a3') },
    { question: t('landing.faq.q4'), answer: t('landing.faq.a4') },
  ];

  const artistFAQ = [
    { question: t('landing.faq.q5'), answer: t('landing.faq.a5') },
    { question: t('landing.faq.q6'), answer: t('landing.faq.a6') },
    { question: t('landing.faq.q7'), answer: t('landing.faq.a7') },
    { question: t('landing.faq.q8'), answer: t('landing.faq.a8') },
  ];

  return (
    <DashboardLayout children={
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('landing.faq.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('landing.faq.subtitle')}</p>
        </div>

        <Tabs defaultValue="developers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="developers" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              {t('landing.faq.devTab')}
            </TabsTrigger>
            <TabsTrigger value="artists" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              {t('landing.faq.artistTab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="developers" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {developerFAQ.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artists" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {artistFAQ.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    } />
  );
}
