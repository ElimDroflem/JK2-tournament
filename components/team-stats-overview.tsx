import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TeamWithStatsAndPlayers } from "@/lib/data-service"; // Import the correct type

interface TeamStatsOverviewProps {
  teams: TeamWithStatsAndPlayers[]; // Use the specific type
}

export default function TeamStatsOverview({ teams }: TeamStatsOverviewProps) {
  if (!teams || teams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No team data available to display stats.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort teams by points (descending)
  const sortedTeams = [...teams].sort(
    (a, b) => (b.team_stats?.points || 0) - (a.team_stats?.points || 0)
  );

  // Get the top team for comparison, handle empty or teams with no stats
  const topTeam = sortedTeams[0];
  const maxPoints = topTeam?.team_stats?.points || 1; // Default to 1 to avoid division by zero if no points

  // Calculate maxCaptures safely, defaulting to 1 if no captures or no teams with stats
  const maxCaptures = Math.max(
    ...teams.map((team) => team.team_stats?.captures || 0),
    1
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Team Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedTeams.map((team) => {
          const currentPoints = team.team_stats?.points || 0;
          const currentCaptures = team.team_stats?.captures || 0;

          // Calculate percentages for visualization
          const pointsPercentage = (currentPoints / maxPoints) * 100;
          // const capturesPercentage = (currentCaptures / maxCaptures) * 100; // This was unused

          // Determine color based on team name
          const progressColor =
            team.name.includes("Force") || team.name.includes("Jedi")
              ? "bg-jedi"
              : team.name.includes("Sith")
              ? "bg-sith"
              : team.name.includes("Beskar") || team.name.includes("Kyber")
              ? "bg-bespin"
              : "bg-imperial";

          return (
            <div key={team.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{team.name}</span>
                <span className="text-sm text-muted-foreground">
                  {currentPoints} pts | {currentCaptures} captures
                </span>
              </div>
              <div className="space-y-1">
                <Progress
                  value={pointsPercentage}
                  className={`h-2 [&>div]:${progressColor}`}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
