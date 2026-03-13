import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";
import { KanbanBoard, KanbanColumn, KanbanCard } from "@/components/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Search,
  Grid3x3,
  List,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Eye,
  EyeOff,
  Star,
  Download,
  ChevronDown,
  LayoutGrid,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ViewMode = "table" | "grid" | "kanban";
type SortBy = "name" | "date" | "price" | "popularity" | "submission";
type Category =
  | "all"
  | "clothing"
  | "hair"
  | "face"
  | "accessories"
  | "animations"
  | "packs";
type Status = "pending" | "in_review" | "approved" | "rejected" | "published";

interface Asset {
  id: number;
  name: string;
  category: string;
  thumbnailUrl: string;
  description: string;
  personalPriceUSD: number;
  commercialPriceUSD: number;
  polyCount: number;
  fileFormat: string;
  createdAt: string;
  submissionDate: string;
  isPublished: boolean;
  isFeatured: boolean;
  status: Status;
  artist: string;
}

// Mock data for demonstration
const mockAssets: Asset[] = [
  {
    id: 1,
    name: "Futuristic Combat Suit",
    category: "clothing",
    thumbnailUrl:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/vsqgvnSDMVJBrIXB.png",
    description: "High-tech combat suit with advanced features",
    personalPriceUSD: 5.0,
    commercialPriceUSD: 25.0,
    polyCount: 45000,
    fileFormat: "FBX",
    createdAt: "2026-01-30",
    submissionDate: "2026-01-30",
    isPublished: true,
    isFeatured: false,
    status: "pending",
    artist: "John Designer",
  },
  {
    id: 2,
    name: "Cyberpunk Hair Pack",
    category: "hair",
    thumbnailUrl:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/vplBngiOVdhCGlPL.png",
    description: "Collection of futuristic hair styles",
    personalPriceUSD: 3.0,
    commercialPriceUSD: 15.0,
    polyCount: 28000,
    fileFormat: "FBX",
    createdAt: "2026-01-29",
    submissionDate: "2026-01-29",
    isPublished: true,
    isFeatured: true,
    status: "pending",
    artist: "Sarah Artist",
  },
  {
    id: 3,
    name: "Elven Face Customization",
    category: "face",
    thumbnailUrl:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/OJnJkyWnaDEtaoyt.png",
    description: "Detailed elven face customization options",
    personalPriceUSD: 4.0,
    commercialPriceUSD: 20.0,
    polyCount: 35000,
    fileFormat: "FBX",
    createdAt: "2026-01-28",
    submissionDate: "2026-01-28",
    isPublished: true,
    isFeatured: false,
    status: "pending",
    artist: "Mike Creator",
  },
  {
    id: 4,
    name: "Dragon Wings Accessory",
    category: "accessories",
    thumbnailUrl:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/oeFhQpHAQQXFZMhb.png",
    description: "Majestic dragon wings for avatars",
    personalPriceUSD: 6.0,
    commercialPriceUSD: 30.0,
    polyCount: 52000,
    fileFormat: "FBX",
    createdAt: "2026-01-27",
    submissionDate: "2026-01-27",
    isPublished: true,
    isFeatured: true,
    status: "approved",
    artist: "Alex Designer",
  },
  {
    id: 5,
    name: "Casual Outfit Pack",
    category: "clothing",
    thumbnailUrl:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/LKyZbibRYsVAgKcj.png",
    description: "Casual everyday clothing collection",
    personalPriceUSD: 7.0,
    commercialPriceUSD: 35.0,
    polyCount: 61000,
    fileFormat: "FBX",
    createdAt: "2026-01-26",
    submissionDate: "2026-01-26",
    isPublished: true,
    isFeatured: false,
    status: "in_review",
    artist: "Emma Creator",
  },
  {
    id: 6,
    name: "Glitchy Animations",
    category: "animations",
    thumbnailUrl:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/ncPYBvMQiCMgIKFu.png",
    description: "Animation pack with technical issues",
    personalPriceUSD: 5.0,
    commercialPriceUSD: 25.0,
    polyCount: 0,
    fileFormat: "FBX",
    createdAt: "2026-01-25",
    submissionDate: "2026-01-25",
    isPublished: false,
    isFeatured: false,
    status: "rejected",
    artist: "Tom Developer",
  },
  {
    id: 7,
    name: "Sci-Fi Pack",
    category: "packs",
    thumbnailUrl:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/bmdgfncQicNdELPC.png",
    description: "Complete sci-fi themed asset collection",
    personalPriceUSD: 15.0,
    commercialPriceUSD: 75.0,
    polyCount: 150000,
    fileFormat: "FBX",
    createdAt: "2026-01-24",
    submissionDate: "2026-01-24",
    isPublished: true,
    isFeatured: true,
    status: "approved",
    artist: "Creative Studio",
  },
  {
    id: 8,
    name: "Fantasy Pack",
    category: "packs",
    thumbnailUrl:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/iNJosVufnOWRIVLZ.png",
    description: "Fantasy-themed assets and accessories",
    personalPriceUSD: 12.0,
    commercialPriceUSD: 60.0,
    polyCount: 120000,
    fileFormat: "FBX",
    createdAt: "2026-01-23",
    submissionDate: "2026-01-23",
    isPublished: true,
    isFeatured: false,
    status: "approved",
    artist: "Fantasy Team",
  },
  {
    id: 9,
    name: "Starters Pack",
    category: "packs",
    thumbnailUrl:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/vsqgvnSDMVJBrIXB.png",
    description: "Essential starter assets for new users",
    personalPriceUSD: 8.0,
    commercialPriceUSD: 40.0,
    polyCount: 85000,
    fileFormat: "FBX",
    createdAt: "2026-01-22",
    submissionDate: "2026-01-22",
    isPublished: true,
    isFeatured: true,
    status: "approved",
    artist: "Beginner Assets",
  },
];

export default function AssetManagement() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [cardNotes, setCardNotes] = useState<Record<string | number, string>>({});
  const [selectedCardForNotes, setSelectedCardForNotes] = useState<{ id: string | number; columnId: string } | null>(null);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notesInput, setNotesInput] = useState("");

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let filtered = assets;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.artist.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "price":
          return a.personalPriceUSD - b.personalPriceUSD;
        case "popularity":
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [assets, selectedCategory, searchQuery, sortBy]);

  const handleCardMove = (cardId: string | number, fromColumnId: string, toColumnId: string) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset.id === cardId
          ? { ...asset, status: toColumnId as Status }
          : asset
      )
    );
    toast.success(`Moved asset to ${toColumnId.replace(/_/g, " ")}`);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map((a) => a.id));
    }
  };

  const handleBulkPublish = () => {
    setAssets((prev) =>
      prev.map((a) =>
        selectedAssets.includes(a.id) ? { ...a, isPublished: true } : a
      )
    );
    toast.success(`Published ${selectedAssets.length} assets`);
    setSelectedAssets([]);
  };

  const handleBulkUnpublish = () => {
    setAssets((prev) =>
      prev.map((a) =>
        selectedAssets.includes(a.id) ? { ...a, isPublished: false } : a
      )
    );
    toast.success(`Unpublished ${selectedAssets.length} assets`);
    setSelectedAssets([]);
  };

  // Kanban columns
  const kanbanColumns: KanbanColumn[] = [
    {
      id: "pending",
      title: "Pending Review",
      color: "yellow",
      icon: <Clock className="w-5 h-5" />,
      cards: filteredAssets
        .filter((a) => a.status === "pending")
        .map((a) => ({
          id: a.id,
          title: a.name,
          description: a.description,
          image: a.thumbnailUrl,
          category: a.category,
          artist: a.artist,
          submittedAt: a.createdAt,
          notes: cardNotes[a.id],
        })),
    },
    {
      id: "in_review",
      title: "In Review",
      color: "cyan",
      icon: <AlertCircle className="w-5 h-5" />,
      cards: filteredAssets
        .filter((a) => a.status === "in_review")
        .map((a) => ({
          id: a.id,
          title: a.name,
          description: a.description,
          image: a.thumbnailUrl,
          category: a.category,
          artist: a.artist,
          submittedAt: a.createdAt,
          notes: cardNotes[a.id],
        })),
    },
    {
      id: "approved",
      title: "Approved",
      color: "green",
      icon: <CheckCircle className="w-5 h-5" />,
      cards: filteredAssets
        .filter((a) => a.status === "approved")
        .map((a) => ({
          id: a.id,
          title: a.name,
          description: a.description,
          image: a.thumbnailUrl,
          category: a.category,
          artist: a.artist,
          submittedAt: a.createdAt,
          notes: cardNotes[a.id],
        })),
    },
    {
      id: "rejected",
      title: "Rejected",
      color: "red",
      icon: <XCircle className="w-5 h-5" />,
      cards: filteredAssets
        .filter((a) => a.status === "rejected")
        .map((a) => ({
          id: a.id,
          title: a.name,
          description: a.description,
          image: a.thumbnailUrl,
          category: a.category,
          artist: a.artist,
          submittedAt: a.createdAt,
          notes: cardNotes[a.id],
        })),
    },
    {
      id: "published",
      title: "Published",
      color: "blue",
      icon: <CheckCircle className="w-5 h-5" />,
      cards: filteredAssets
        .filter((a) => a.status === "published")
        .map((a) => ({
          id: a.id,
          title: a.name,
          description: a.description,
          image: a.thumbnailUrl,
          category: a.category,
          artist: a.artist,
          submittedAt: a.createdAt,
          notes: cardNotes[a.id],
        })),
    },
  ];

  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Header */}
        <div className="px-6 py-8 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Asset Management</h1>
            <p className="text-muted-foreground mb-6">
              View, organize, and manage all your published assets
            </p>

            {/* Search and Filters */}
            <div className="flex gap-4 mb-6 flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>

              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category)}>
                <SelectTrigger className="w-40 bg-background border-border">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="hair">Hair</SelectItem>
                  <SelectItem value="face">Face</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="animations">Animations</SelectItem>
                  <SelectItem value="packs">Packs</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                <SelectTrigger className="w-40 bg-background border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Newest First</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 items-center">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                Table
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2"
              >
                <Grid3x3 className="w-4 h-4" />
                Gallery
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                Kanban
              </Button>

              {selectedAssets.length > 0 && (
                <div className="ml-auto flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkPublish}
                  >
                    Publish ({selectedAssets.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkUnpublish}
                  >
                    Unpublish ({selectedAssets.length})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-background">
          {viewMode === "kanban" ? (
            <KanbanBoard
              columns={kanbanColumns}
              onCardMove={handleCardMove}
              onCardClick={(card, columnId) => {
                setSelectedCardForNotes({ id: card.id, columnId });
                setNotesInput(cardNotes[card.id] || "");
                setNotesDialogOpen(true);
              }}
            />
          ) : viewMode === "grid" ? (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-card rounded-lg overflow-hidden hover:border-cyan-500 border border-border transition-all cursor-pointer group"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setDetailsDialogOpen(true);
                    }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <img
                        src={asset.thumbnailUrl}
                        alt={asset.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {asset.isFeatured && (
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        )}
                        {asset.isPublished && (
                          <Eye className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-card-foreground mb-1 truncate">
                        {asset.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {asset.description}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-cyan-400">${asset.personalPriceUSD}</span>
                        <span className="text-gray-500 text-xs">
                          {asset.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4">
                        <Checkbox
                          checked={
                            selectedAssets.length === filteredAssets.length &&
                            filteredAssets.length > 0
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                        Name
                      </th>
                      <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                        Category
                      </th>
                      <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                        Price (USD)
                      </th>
                      <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                        Submission Date
                      </th>
                      <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                        Status
                      </th>
                      <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="py-4 px-4">
                          <Checkbox
                            checked={selectedAssets.includes(asset.id)}
                            onChange={() => handleToggleSelect(asset.id)}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={asset.thumbnailUrl}
                              alt={asset.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <p className="text-foreground font-medium">
                                {asset.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {asset.artist}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-foreground">
                          {asset.category}
                        </td>
                        <td className="py-4 px-4 text-foreground">
                          ${asset.personalPriceUSD}
                        </td>
                        <td className="py-4 px-4 text-foreground">
                          {new Date(asset.submissionDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              asset.status === "approved"
                                ? "bg-green-500/20 text-green-400"
                                : asset.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : asset.status === "in_review"
                                ? "bg-cyan-500/20 text-cyan-400"
                                : asset.status === "published"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {asset.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setDetailsDialogOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-2xl bg-popover border-border">
            <DialogHeader>
              <DialogTitle className="text-popover-foreground">
                {selectedAsset?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedAsset && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={selectedAsset.thumbnailUrl}
                    alt={selectedAsset.name}
                    className="w-48 h-auto object-contain rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Artist</p>
                    <p className="text-foreground font-medium">
                      {selectedAsset.artist}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="text-foreground font-medium">
                      {selectedAsset.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Personal Price</p>
                    <p className="text-foreground font-medium">
                      ${selectedAsset.personalPriceUSD}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Commercial Price</p>
                    <p className="text-foreground font-medium">
                      ${selectedAsset.commercialPriceUSD}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Poly Count</p>
                    <p className="text-foreground font-medium">
                      {selectedAsset.polyCount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Format</p>
                    <p className="text-foreground font-medium">
                      {selectedAsset.fileFormat}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-2">Description</p>
                  <p className="text-foreground">{selectedAsset.description}</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDetailsDialogOpen(false)}
                className="border-border"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notes Dialog */}
        <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
          <DialogContent className="bg-popover border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-popover-foreground">Add Notes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Add comments or notes about this asset..."
                className="w-full h-32 bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setNotesDialogOpen(false)}
                className="border-border"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedCardForNotes) {
                    setCardNotes((prev) => ({
                      ...prev,
                      [selectedCardForNotes.id]: notesInput,
                    }));
                    setNotesDialogOpen(false);
                    toast.success("Notes saved");
                  }
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Save Notes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
