import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KanbanCard {
  id: string | number;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  artist?: string;
  submittedAt?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  icon: React.ReactNode;
  cards: KanbanCard[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onCardMove?: (cardId: string | number, fromColumnId: string, toColumnId: string) => void;
  onCardClick?: (card: KanbanCard, columnId: string) => void;
  onCardAction?: (card: KanbanCard, action: string) => void;
}

export function KanbanBoard({
  columns,
  onCardMove,
  onCardClick,
  onCardAction,
}: KanbanBoardProps) {
  const [draggedCard, setDraggedCard] = useState<{
    cardId: string | number;
    fromColumnId: string;
  } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (
    e: React.DragEvent,
    cardId: string | number,
    columnId: string
  ) => {
    setDraggedCard({ cardId, fromColumnId: columnId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (columnId: string) => {
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if ((e.target as HTMLElement).classList.contains("kanban-column")) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    if (draggedCard && onCardMove) {
      onCardMove(draggedCard.cardId, draggedCard.fromColumnId, toColumnId);
    }
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const getColumnColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "border-blue-500/50 bg-blue-500/5",
      green: "border-green-500/50 bg-green-500/5",
      yellow: "border-yellow-500/50 bg-yellow-500/5",
      red: "border-red-500/50 bg-red-500/5",
      cyan: "border-cyan-500/50 bg-cyan-500/5",
    };
    return colors[color] || colors.blue;
  };

  const getHeaderColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-500/20 text-blue-400",
      green: "bg-green-500/20 text-green-400",
      yellow: "bg-yellow-500/20 text-yellow-400",
      red: "bg-red-500/20 text-red-400",
      cyan: "bg-cyan-500/20 text-cyan-400",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="w-full overflow-x-auto bg-background">
      <div className="flex gap-6 min-w-max p-6 pb-2">
        {columns.map((column) => (
          <div
            key={column.id}
            className="kanban-column flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={cn("rounded-lg p-4 mb-4", getHeaderColor(column.color))}>
              <div className="flex items-center gap-2 mb-2">
                {column.icon}
                <h3 className="font-semibold">{column.title}</h3>
              </div>
              <p className="text-xs opacity-75">{column.cards.length} items</p>
            </div>

            {/* Column Content */}
            <div
              className={cn(
                "rounded-lg border-2 p-4 min-h-96 transition-colors",
                dragOverColumn === column.id
                  ? getColumnColor(column.color)
                  : "border-border bg-card"
              )}
            >
              <div className="space-y-3">
                {column.cards.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <p className="text-sm">No items</p>
                  </div>
                ) : (
                  column.cards.map((card) => (
                    <Card
                      key={card.id}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, card.id, column.id)
                      }
                      onClick={() => onCardClick?.(card, column.id)}
                      className={cn(
                        "bg-card border-border p-4 cursor-move hover:border-muted-foreground/50 transition group relative",
                        draggedCard?.cardId === card.id && "opacity-50"
                      )}
                    >
                      {/* Card Image */}
                      {card.image && (
                        <div className="w-full aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-muted">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="space-y-1 mb-0">
                        <h4 className="font-semibold text-sm line-clamp-2">
                          {card.title}
                        </h4>

                        {card.artist && (
                          <p className="text-xs text-muted-foreground">by {card.artist}</p>
                        )}

                        {card.category && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                            {card.category}
                          </Badge>
                        )}

                        {card.submittedAt && (
                          <p className="text-xs text-muted-foreground/70">
                            {card.submittedAt}
                          </p>
                        )}

                        {card.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {card.description}
                          </p>
                        )}
                      </div>

                      {/* Notes Display on Hover */}
                      {card.notes && (
                        <div className="absolute inset-0 bg-card/95 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between pointer-events-none">
                          <div>
                            <p className="text-xs font-semibold text-cyan-400 mb-2">Notes</p>
                            <p className="text-xs text-foreground line-clamp-6">{card.notes}</p>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
