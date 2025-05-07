import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface TeamStatsOverviewProps {
  teams: any[]
}

export default function TeamStatsOverview({ teams }: TeamStatsOverviewProps) {
  // Sort teams by points (descending)
  const sortedTeams = [...teams].sort((a, b) => b.stats.points - a.stats.points)

  // Get the top team for comparison
  const topTeam = sortedTeams[0]
  const maxPoints = topTeam.stats.points
  const maxCaptures = Math.max(...teams.map((team) => team.stats.captures))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Team Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedTeams.map((team) => {
          // Calculate percentages for visualization
          const pointsPercentage = (team.stats.points / maxPoints) * 100
          const capturesPercentage = (team.stats.captures / maxCaptures) * 100

          // Determine color based on team name
          const progressColor =
            team.name.includes("Force") || team.name.includes("Jedi")
              ? "bg-jedi"
              : team.name.includes("Sith")
                ? "bg-sith"
                : team.name.includes("Beskar") || team.name.includes("Kyber")
                  ? "bg-bespin"
                  : "bg-imperial"

          return (
            <div key={team.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{team.name}</span>
                <span className="text-sm text-muted-foreground">
                  {team.stats.points} pts | {team.stats.captures} captures
                </span>
              </div>
              <div className="space-y-1">
                <Progress value={pointsPercentage} className={`h-2 [&>div]:${progressColor}`} />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
