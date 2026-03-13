import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Plus, Loader2, Edit, Trash2, Copy, Download, Share2, MoreVertical } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MyAvatars() {
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  
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

  const deleteMutation = trpc.avatarProjects.delete.useMutation({
    onSuccess: () => {
      utils.avatarProjects.list.invalidate();
      toast.success(t('avatars.deleteSuccess'));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const duplicateMutation = trpc.avatarProjects.duplicate.useMutation({
    onSuccess: () => {
      utils.avatarProjects.list.invalidate();
      toast.success(t('avatars.duplicateSuccess'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (_projectId: number) => {
    toast.info(t('common.featureSoon'));
  };

  const handleDelete = (projectId: number) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate({ id: projectToDelete });
    }
  };

  const handleDuplicate = (projectId: number) => {
    duplicateMutation.mutate({ id: projectId });
  };

  const handleExport = (_projectId: number) => {
    toast.info(t('common.featureSoon'));
  };

  const handleShare = (_projectId: number) => {
    toast.info(t('common.featureSoon'));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* My Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('avatars.myProjects')}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('avatars.savedProjects')}
              </p>
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
                      className="w-full h-full object-cover object-center"
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
                  
                  {/* Hover Actions Menu */}
                  <div className="absolute top-2 left-2 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handleEdit(project.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('common.editOpen')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(project.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          {t('common.duplicate')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport(project.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          {t('common.export')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare(project.id)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          {t('common.share')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(project.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate drop-shadow">{project.name}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">{t('avatars.noProjects')}</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
                {t('avatars.createFirst')}
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('avatars.createNewTitle')}</DialogTitle>
            <DialogDescription>
              {t('avatars.createNewDesc')}
            </DialogDescription>
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
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={createMutation.isPending}
            >
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('avatars.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('avatars.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('avatars.deleting')}
                </>
              ) : (
                t('common.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
