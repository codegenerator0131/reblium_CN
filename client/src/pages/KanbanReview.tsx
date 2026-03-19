import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";
import { KanbanBoard, KanbanColumn, KanbanCard } from "@/components/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, XCircle, Clock, Search } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface Submission {
  id: number;
  title: string;
  artist: string;
  category: string;
  status: "pending" | "approved" | "revision_required" | "rejected";
  submittedAt: string;
  image: string;
  description: string;
}

// Database store items with thumbnails - used as placeholder images
const storeItemImages: Record<string, string> = {
  "Futuristic Combat Suit": "/assets/images/kanban-1.jpg",
  "Cyberpunk Hair Pack": "/assets/images/kanban-2.jpg",
  "Elven Face Customization": "/assets/images/kanban-3.jpg",
  "Dragon Wings Accessory": "/assets/images/kanban-4.jpg",
  "Casual Outfit Pack": "/assets/images/kanban-5.jpg",
  "Glitchy Animations": "/assets/images/kanban-6.jpg",
  "Sci-Fi Pack": "/assets/images/kanban-7.jpg",
  "Fantasy Pack": "/assets/images/kanban-8.jpg",
  "Starters Pack": "/assets/images/kanban-9.jpg",
};

export default function KanbanReview() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<"approved" | "revision_required" | "rejected">("approved");
  const [reviewFeedback, setReviewFeedback] = useState({
    visualQuality: "",
    technical: "",
    optimization: "",
    naming: "",
    overall: "",
  });

  // State for submissions - can be updated when dragging
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 1,
      title: "Futuristic Combat Suit",
      artist: "John Designer",
      category: "clothing",
      status: "pending",
      submittedAt: "2026-01-30",
      image: storeItemImages["Futuristic Combat Suit"],
      description: "High-tech combat suit with advanced features",
    },
    {
      id: 2,
      title: "Cyberpunk Hair Pack",
      artist: "Sarah Artist",
      category: "hair",
      status: "pending",
      submittedAt: "2026-01-29",
      image: storeItemImages["Cyberpunk Hair Pack"],
      description: "Collection of futuristic hair styles",
    },
    {
      id: 3,
      title: "Elven Face Customization",
      artist: "Mike Creator",
      category: "face",
      status: "pending",
      submittedAt: "2026-01-28",
      image: storeItemImages["Elven Face Customization"],
      description: "Detailed elven face customization options",
    },
    {
      id: 4,
      title: "Dragon Wings Accessory",
      artist: "Alex Designer",
      category: "accessories",
      status: "approved",
      submittedAt: "2026-01-27",
      image: storeItemImages["Dragon Wings Accessory"],
      description: "Majestic dragon wings for avatars",
    },
    {
      id: 5,
      title: "Casual Outfit Pack",
      artist: "Emma Creator",
      category: "clothing",
      status: "revision_required",
      submittedAt: "2026-01-26",
      image: storeItemImages["Casual Outfit Pack"],
      description: "Casual everyday clothing collection",
    },
    {
      id: 6,
      title: "Glitchy Animations",
      artist: "Tom Developer",
      category: "animations",
      status: "rejected",
      submittedAt: "2026-01-25",
      image: storeItemImages["Glitchy Animations"],
      description: "Animation pack with technical issues",
    },
    {
      id: 7,
      title: "Sci-Fi Pack",
      artist: "Creative Studio",
      category: "packs",
      status: "pending",
      submittedAt: "2026-01-24",
      image: storeItemImages["Sci-Fi Pack"],
      description: "Complete sci-fi themed asset collection",
    },
    {
      id: 8,
      title: "Fantasy Pack",
      artist: "Fantasy Team",
      category: "packs",
      status: "approved",
      submittedAt: "2026-01-23",
      image: storeItemImages["Fantasy Pack"],
      description: "Fantasy-themed assets and accessories",
    },
    {
      id: 9,
      title: "Starters Pack",
      artist: "Beginner Assets",
      category: "packs",
      status: "approved",
      submittedAt: "2026-01-22",
      image: storeItemImages["Starters Pack"],
      description: "Essential starter assets for new users",
    },
  ]);

  // Filter submissions based on search - MUST be before conditional
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery) return submissions;
    const query = searchQuery.toLowerCase();
    return submissions.filter(
      (sub) =>
        sub.title.toLowerCase().includes(query) ||
        sub.artist.toLowerCase().includes(query) ||
        sub.category.toLowerCase().includes(query)
    );
  }, [searchQuery, submissions]);

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
            <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">{t('kanban.accessDenied')}</h2>
            <p className="text-muted-foreground">{t('kanban.accessDeniedDesc')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Map status IDs to status values
  const statusMap: Record<string, "pending" | "approved" | "revision_required" | "rejected"> = {
    pending: "pending",
    approved: "approved",
    revision_required: "revision_required",
    rejected: "rejected",
  };

  // Organize submissions by status
  const kanbanColumns: KanbanColumn[] = [
    {
      id: "pending",
      title: t('kanban.pendingReview'),
      color: "yellow",
      icon: <Clock className="w-5 h-5" />,
      cards: filteredSubmissions
        .filter((s) => s.status === "pending")
        .map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          image: s.image,
          category: s.category,
          artist: s.artist,
          submittedAt: s.submittedAt,
        })),
    },
    {
      id: "approved",
      title: t('kanban.approved'),
      color: "green",
      icon: <CheckCircle className="w-5 h-5" />,
      cards: filteredSubmissions
        .filter((s) => s.status === "approved")
        .map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          image: s.image,
          category: s.category,
          artist: s.artist,
          submittedAt: s.submittedAt,
        })),
    },
    {
      id: "revision_required",
      title: t('kanban.revisionRequired'),
      color: "cyan",
      icon: <AlertCircle className="w-5 h-5" />,
      cards: filteredSubmissions
        .filter((s) => s.status === "revision_required")
        .map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          image: s.image,
          category: s.category,
          artist: s.artist,
          submittedAt: s.submittedAt,
        })),
    },
    {
      id: "rejected",
      title: t('kanban.rejected'),
      color: "red",
      icon: <XCircle className="w-5 h-5" />,
      cards: filteredSubmissions
        .filter((s) => s.status === "rejected")
        .map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          image: s.image,
          category: s.category,
          artist: s.artist,
          submittedAt: s.submittedAt,
        })),
    },
  ];

  const handleCardMove = (cardId: string | number, fromColumnId: string, toColumnId: string) => {
    // Update the submission status
    setSubmissions((prevSubmissions) =>
      prevSubmissions.map((sub) =>
        sub.id === cardId
          ? { ...sub, status: statusMap[toColumnId] }
          : sub
      )
    );
    
    const newStatus = statusMap[toColumnId];
    toast.success(t('kanban.movedTo').replace('{status}', newStatus.replace(/_/g, ' ')));
  };

  const handleCardClick = (card: KanbanCard, columnId: string) => {
    setSelectedCard(card);
    setSelectedColumnId(columnId);
  };

  const handleCardAction = (card: KanbanCard, action: string) => {
    if (action === "review") {
      setSelectedCard(card);
      setReviewDialogOpen(true);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedCard) return;

    try {
      toast.success(t('kanban.reviewSubmitted').replace('{title}', selectedCard.title));
      setReviewDialogOpen(false);
      setReviewFeedback({
        visualQuality: "",
        technical: "",
        optimization: "",
        naming: "",
        overall: "",
      });
      setSelectedCard(null);
    } catch (error) {
      toast.error(t('kanban.reviewFailed'));
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="px-6 py-8 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{t('kanban.title')}</h1>
            <p className="text-muted-foreground mb-6">{t('kanban.subtitle')}</p>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t('kanban.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
          </div>
        </div>

        <div className="bg-background">
          <KanbanBoard
            columns={kanbanColumns}
            onCardMove={handleCardMove}
            onCardClick={handleCardClick}
            onCardAction={handleCardAction}
          />
        </div>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-2xl bg-popover border-border">
            <DialogHeader>
              <DialogTitle className="text-popover-foreground">{t('kanban.reviewAsset')}: {selectedCard?.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedCard?.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={selectedCard.image}
                    alt={selectedCard.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('kanban.artist')}</p>
                  <p className="text-foreground font-medium">{selectedCard?.artist}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('kanban.category')}</p>
                  <p className="text-foreground font-medium">{selectedCard?.category}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t('kanban.visualQuality')}</label>
                <Textarea
                  placeholder={t('kanban.visualQualityPlaceholder')}
                  value={reviewFeedback.visualQuality}
                  onChange={(e) =>
                    setReviewFeedback({ ...reviewFeedback, visualQuality: e.target.value })
                  }
                  className="bg-background border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t('kanban.technicalCorrectness')}</label>
                <Textarea
                  placeholder={t('kanban.technicalPlaceholder')}
                  value={reviewFeedback.technical}
                  onChange={(e) =>
                    setReviewFeedback({ ...reviewFeedback, technical: e.target.value })
                  }
                  className="bg-background border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t('kanban.overallComments')}</label>
                <Textarea
                  placeholder={t('kanban.overallPlaceholder')}
                  value={reviewFeedback.overall}
                  onChange={(e) =>
                    setReviewFeedback({ ...reviewFeedback, overall: e.target.value })
                  }
                  className="bg-background border-border"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setReviewDialogOpen(false)}
                className="border-border"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleReviewSubmit}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {t('kanban.submitReview')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
