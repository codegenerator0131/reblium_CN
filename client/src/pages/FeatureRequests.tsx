import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ThumbsUp, ThumbsDown, Plus, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";

export function FeatureRequests() {
  const { t } = useLanguage();
  const [userIdentifier, setUserIdentifier] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("UI/UX");
  const [description, setDescription] = useState("");

  const categories = ["UI/UX", "Performance", "Features", "Documentation", "Other"];

  // Get or generate user identifier (IP/session based)
  useEffect(() => {
    const stored = localStorage.getItem("userIdentifier");
    if (stored) {
      setUserIdentifier(stored);
    } else {
      const newId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userIdentifier", newId);
      setUserIdentifier(newId);
    }
  }, []);

  const { data: requests, isLoading, refetch } = trpc.featureRequests.getAll.useQuery();
  const createMutation = trpc.featureRequests.create.useMutation({
    onSuccess: () => {
      setUserName("");
      setTitle("");
      setCategory("UI/UX");
      setDescription("");
      setIsOpen(false);
      setEditingId(null);
      refetch();
    },
  });
  
  const updateMutation = trpc.featureRequests.update.useMutation({
    onSuccess: () => {
      setUserName("");
      setTitle("");
      setCategory("UI/UX");
      setDescription("");
      setIsOpen(false);
      setEditingId(null);
      refetch();
    },
  });
  
  const deleteMutation = trpc.featureRequests.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const voteMutation = trpc.featureRequests.vote.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Get current user ID from localStorage (mock user for public mode)
  const userId = parseInt(localStorage.getItem("userId") || "1", 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !title || !category || !description) return;

    if (editingId) {
      await updateMutation.mutateAsync({
        requestId: editingId,
        userId,
        title,
        category,
        description,
      });
    } else {
      await createMutation.mutateAsync({
        userId,
        userName,
        title,
        category,
        description,
      });
    }
  };

  const handleEdit = (request: any) => {
    setEditingId(request.id);
    setUserName(request.userName);
    setTitle(request.title);
    setCategory(request.category);
    setDescription(request.description);
    setIsOpen(true);
  };

  const handleDelete = (requestId: number) => {
    if (confirm(t('featureRequests.deleteConfirm'))) {
      deleteMutation.mutate({
        requestId,
        userId,
      });
    }
  };

  const handleVote = (requestId: number, voteType: "upvote" | "downvote") => {
    if (!userIdentifier) return;
    voteMutation.mutate({
      requestId,
      userIdentifier,
      voteType,
    });
  };

  const handleReset = () => {
    setUserName("");
    setTitle("");
    setCategory("UI/UX");
    setDescription("");
    setEditingId(null);
  };

  return (
    <DashboardLayout children={
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("featureRequests")}</h1>
            <p className="text-muted-foreground mt-2">{t("suggestNewFeatures")}</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t("newRequest")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? t('featureRequests.editTitle') : t("submitFeatureRequest")}</DialogTitle>
                <DialogDescription>{editingId ? t('featureRequests.editDesc') : t("shareFeatureIdea")}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{t("userName")}</label>
                  <Input
                    placeholder={t("enterYourName")}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={!!editingId}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t("title")}</label>
                  <Input
                    placeholder={t("briefTitle")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t("category")}</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">{t("description")}</label>
                  <Textarea
                    placeholder={t("detailedDescription")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="min-h-24"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleReset}>
                    {t("cancel")}
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? t('featureRequests.submitting') : editingId ? t('featureRequests.updateRequest') : t("submitRequest")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-8">{t("loading")}</div>
        ) : !requests || requests.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              {t("noFeatureRequests")}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <CardDescription className="mt-1">
                        by <span className="font-medium text-foreground">{request.userName}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{request.category}</Badge>
                      {request.userId === userId && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(request)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(request.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1"
                      onClick={() => handleVote(request.id, "upvote")}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {request.upvotes}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1"
                      onClick={() => handleVote(request.id, "downvote")}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      {request.downvotes}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    } />
  );
}
