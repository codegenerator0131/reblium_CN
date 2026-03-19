import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Projects() {
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  
  const projectsQuery = trpc.avatarProjects.list.useQuery();
  const utils = trpc.useUtils();
  
  const createMutation = trpc.avatarProjects.create.useMutation({
    onSuccess: () => {
      utils.avatarProjects.list.invalidate();
      setIsCreateDialogOpen(false);
      setProjectName("");
      toast.success(t('avatars.createSuccess'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast.error(t('avatars.nameRequired'));
      return;
    }
    createMutation.mutate({ name: projectName });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('avatars.myProjects')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('projects.manageProjects')}</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('avatars.createNew')}
          </Button>
        </div>

        {projectsQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projectsQuery.data && projectsQuery.data.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {projectsQuery.data.map((project) => (
              <Card
                key={project.id}
                className="group relative aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              >
                {project.thumbnailUrl ? (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">{t('avatars.noPreview')}</span>
                  </div>
                )}
                {project.isPublished && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    {t('avatars.published')}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white text-sm font-medium truncate">{project.name}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">{t('avatars.noProjects')}</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
              {t('avatars.createFirst')}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('avatars.createNewTitle')}</DialogTitle>
            <DialogDescription>{t('avatars.createNewDesc')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('avatars.projectName')}</Label>
              <Input
                id="name"
                placeholder={t('avatars.projectNamePlaceholder')}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateProject();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleCreateProject} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('avatars.creating')}
                </>
              ) : (
                t('avatars.createProject')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
