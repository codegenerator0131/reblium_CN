import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

export function Poll() {
  const { t } = useLanguage();
  const [voterIdentifier, setVoterIdentifier] = useState<string>("");

  const pollQuery = trpc.polls.getActive.useQuery();
  const voteMutation = trpc.polls.vote.useMutation();

  // Generate or retrieve voter identifier from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("poll_voter_id");
    if (stored) {
      setVoterIdentifier(stored);
    } else {
      const newId = `voter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("poll_voter_id", newId);
      setVoterIdentifier(newId);
    }
  }, []);

  const handleVote = async (optionId: number) => {
    if (!pollQuery.data || !voterIdentifier) return;

    try {
      await voteMutation.mutateAsync({
        pollId: pollQuery.data.id,
        optionId,
        voterIdentifier,
      });

      // Vote recorded

      // Refetch poll to show updated results
      pollQuery.refetch();
    } catch (error) {
      console.error("Vote error:", error);
    }
  };

  if (!pollQuery.data) {
    return null;
  }

  const totalVotes = pollQuery.data.options.reduce((sum, opt) => sum + opt.voteCount, 0);

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border-purple-500/30">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {pollQuery.data.question}
          </h3>
          {pollQuery.data.description && (
            <p className="text-sm text-muted-foreground">
              {pollQuery.data.description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {pollQuery.data.options.map((option) => {
            const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;

            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {option.option}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {option.voteCount} votes
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <Button
                  onClick={() => handleVote(option.id)}
                  disabled={voteMutation.isPending}
                  size="sm"
                  className="w-full"
                >
                  {t('home.vote')}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Total votes: {totalVotes}
          </p>
        </div>
      </div>
    </Card>
  );
}
