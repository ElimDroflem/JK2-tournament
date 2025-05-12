import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Trophy, Users } from "lucide-react";
import type {
  TeamWithStatsAndPlayers,
  PlayerWithStatsAndTeamName,
} from "@/lib/data-service";

interface TeamDetailCardProps {
  team: TeamWithStatsAndPlayers;
  players: PlayerWithStatsAndTeamName[];
}

export default function TeamDetailCard({ team, players }: TeamDetailCardProps) {
  // Safely access stats for calculations
  const matchesPlayed = team.team_stats?.matches_played || 0;
  const matchesWon = team.team_stats?.matches_won || 0;
  const captures = team.team_stats?.captures || 0;
  const flagReturns = team.team_stats?.flag_returns || 0;
  const points = team.team_stats?.points || 0;

  // Calculate win percentage
  const winPercentage =
    matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0;

  // Get team color class based on team name
  const getTeamColorClass = (teamName: string) => {
    if (teamName.includes("Force") || teamName.includes("Jedi")) {
      return "text-jedi";
    } else if (teamName.includes("Sith")) {
      return "text-sith";
    } else if (teamName.includes("Beskar") || teamName.includes("Kyber")) {
      return "text-bespin";
    } else {
      return "text-imperial";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              team.name.includes("Force") || team.name.includes("Jedi")
                ? "bg-jedi/20"
                : team.name.includes("Sith")
                ? "bg-sith/20"
                : "bg-imperial/20"
            }`}
          >
            <Shield className={`h-6 w-6 ${getTeamColorClass(team.name)}`} />
          </div>
          <div>
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>Team Performance Overview</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Win Rate</span>
                <span
                  className={`text-sm font-medium ${getTeamColorClass(
                    team.name
                  )}`}
                >
                  {winPercentage}%
                </span>
              </div>
              <Progress value={winPercentage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Flag Efficiency</span>
                <span
                  className={`text-sm font-medium ${getTeamColorClass(
                    team.name
                  )}`}
                >
                  {captures}/{flagReturns}
                </span>
              </div>
              <Progress
                value={
                  flagReturns > 0
                    ? (captures / Math.max(1, flagReturns)) * 100
                    : 0
                }
                className="h-2"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Tournament Points</div>
                <div
                  className={`text-xl font-bold ${getTeamColorClass(
                    team.name
                  )}`}
                >
                  {points}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Team Size</div>
                <div className="text-xl font-bold">
                  {players.length} players
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Founded</div>
                <div className="text-xl font-bold">{team.founded}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Top Performers</h4>
            <div className="space-y-2">
              {players
                .sort(
                  (a, b) =>
                    (b.player_stats?.impact || 0) -
                    (a.player_stats?.impact || 0)
                )
                .slice(0, 3)
                .map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-background p-2 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={`${
                            team.name.includes("Force") ||
                            team.name.includes("Jedi")
                              ? "bg-jedi/20 text-jedi"
                              : team.name.includes("Sith")
                              ? "bg-sith/20 text-sith"
                              : "bg-imperial/20 text-bespin"
                          }`}
                        >
                          {(player.name || "NN").substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">
                        {player.name || "Unknown Player"}
                      </div>
                    </div>
                    <div className="text-right font-medium text-jkhub">
                      Impact: {player.player_stats?.impact || 0}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
