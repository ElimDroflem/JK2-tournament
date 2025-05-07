import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Swords, Trophy, Users } from "lucide-react"
import { getTeamById, getPlayers, getMatchHistory, getUpcomingMatches } from "@/lib/data-service"
import TeamDetailCard from "@/components/team-detail-card"

export default async function TeamPage({ params }: { params: { id: string } }) {
  const teamId = Number.parseInt(params.id)
  const team = await getTeamById(teamId)

  if (!team) {
    notFound()
  }

  // Get all players
  const allPlayers = await getPlayers()

  // Get team players
  const teamPlayers = allPlayers.filter((player) => player.team === team.name)

  // Get team matches
  const allMatches = await getMatchHistory()
  const teamMatchHistory = allMatches.filter((match) => match.teamA === team.name || match.teamB === team.name)

  const allUpcomingMatches = await getUpcomingMatches()
  const teamUpcomingMatches = allUpcomingMatches.filter(
    (match) => match.teamA === team.name || match.teamB === team.name,
  )

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-full ${
                  team.name.includes("Force") || team.name.includes("Jedi")
                    ? "bg-jedi/20"
                    : team.name.includes("Sith")
                      ? "bg-sith/20"
                      : "bg-imperial/20"
                }`}
              >
                <Shield
                  className={`h-10 w-10 ${
                    team.name.includes("Force") || team.name.includes("Jedi")
                      ? "text-jedi"
                      : team.name.includes("Sith")
                        ? "text-sith"
                        : "text-bespin"
                  }`}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
                <p className="text-muted-foreground">Founded: {team.founded}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/teams">
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  All Teams
                </Button>
              </Link>
            </div>
          </div>

          <TeamDetailCard team={team} players={teamPlayers} />

          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.stats.matchesPlayed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Wins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.stats.matchesWon}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Flag Captures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.stats.captures}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tournament Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.stats.points}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="players">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="players" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Players
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex items-center">
                <Swords className="mr-2 h-4 w-4" />
                Matches
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center">
                <Trophy className="mr-2 h-4 w-4" />
                Team Stats
              </TabsTrigger>
            </TabsList>
            <TabsContent value="players" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Roster</CardTitle>
                  <CardDescription>Players currently on {team.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-right">Captures</TableHead>
                        <TableHead className="text-right">Returns</TableHead>
                        <TableHead className="text-right">Kills</TableHead>
                        <TableHead className="text-right">K/D</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamPlayers.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback
                                  className={`${
                                    team.name.includes("Force") || team.name.includes("Jedi")
                                      ? "bg-jedi/20 text-jedi"
                                      : team.name.includes("Sith")
                                        ? "bg-sith/20 text-sith"
                                        : "bg-imperial/20 text-bespin"
                                  }`}
                                >
                                  {player.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <div className="font-medium">{player.name}</div>
                                <div className="text-xs text-muted-foreground">Role: {player.role || "Player"}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{player.stats.flagCaptures}</TableCell>
                          <TableCell className="text-right">{player.stats.flagReturns}</TableCell>
                          <TableCell className="text-right">{player.stats.overallKills}</TableCell>
                          <TableCell className="text-right">
                            {(player.stats.overallKills / Math.max(1, player.stats.overallDeaths)).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="matches" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Match History</CardTitle>
                  <CardDescription>Past and upcoming matches for {team.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Upcoming Matches</h3>
                      {teamUpcomingMatches.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Match</TableHead>
                              <TableHead>Opponent</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Time</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {teamUpcomingMatches.map((match) => (
                              <TableRow key={match.id}>
                                <TableCell>
                                  <Badge variant="outline">{match.round}</Badge>
                                </TableCell>
                                <TableCell>{match.teamA === team.name ? match.teamB : match.teamA}</TableCell>
                                <TableCell>{match.date}</TableCell>
                                <TableCell>{match.time}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-muted-foreground">No upcoming matches scheduled.</p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3">Past Matches</h3>
                      {teamMatchHistory.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Match</TableHead>
                              <TableHead>Opponent</TableHead>
                              <TableHead>Result</TableHead>
                              <TableHead>Score</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {teamMatchHistory.map((match) => {
                              const isTeamA = match.teamA === team.name
                              const opponent = isTeamA ? match.teamB : match.teamA
                              const teamScore = isTeamA ? match.scoreA : match.scoreB
                              const opponentScore = isTeamA ? match.scoreB : match.scoreA
                              const result =
                                teamScore > opponentScore ? "Win" : teamScore < opponentScore ? "Loss" : "Draw"

                              return (
                                <TableRow key={match.id}>
                                  <TableCell>
                                    <Badge variant="outline">{match.round}</Badge>
                                  </TableCell>
                                  <TableCell>{opponent}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        result === "Win" ? "success" : result === "Loss" ? "destructive" : "outline"
                                      }
                                      className={
                                        result === "Win"
                                          ? "bg-green-500/10 text-green-500"
                                          : result === "Loss"
                                            ? "bg-red-500/10 text-red-500"
                                            : ""
                                      }
                                    >
                                      {result}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {teamScore} - {opponentScore}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-muted-foreground">No match history available.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stats" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Team Statistics</CardTitle>
                  <CardDescription>Performance metrics for {team.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Match Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Matches Played</p>
                          <p className="text-xl font-bold">{team.stats.matchesPlayed}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Matches Won</p>
                          <p className="text-xl font-bold">{team.stats.matchesWon}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Matches Drawn</p>
                          <p className="text-xl font-bold">{team.stats.matchesDrawn}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Matches Lost</p>
                          <p className="text-xl font-bold">{team.stats.matchesLost}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Flag Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Flag Captures</p>
                          <p className="text-xl font-bold">{team.stats.captures}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Flag Returns</p>
                          <p className="text-xl font-bold">{team.stats.flagReturns}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Total Kills</p>
                          <p className="text-xl font-bold">{team.stats.kills}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Tournament Points</p>
                          <p className="text-xl font-bold">{team.stats.points}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
