import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Templates() {
  const { t } = useLanguage();
  const templatesQuery = trpc.templates.list.useQuery();
  
  const handleUseTemplate = (_templateId: number, templateName: string) => {
    toast.success(`"${templateName}" ${t('common.featureSoon')}`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('templates.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('templates.subtitle')}</p>
        </div>

        {templatesQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : templatesQuery.data && templatesQuery.data.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {templatesQuery.data.map((template) => (
              <Card
                key={template.id}
                className="group relative aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => handleUseTemplate(template.id, template.name)}
              >
                <img
                  src={template.thumbnailUrl}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white text-sm font-medium truncate">{template.name}</p>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm">{t('templates.useTemplate')}</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            {t('templates.noTemplates')}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
