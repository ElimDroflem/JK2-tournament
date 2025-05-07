import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Shield, Trophy, Users } from "lucide-react"
import { getTeams, getPlayers } from "@/lib/data-service"
import DataStatus from "@/components/data-status"

export default async function LeaderboardsPage() {
  // Fetch teams and players from Supabase
  const teams = await getTeams()
  const players = await getPlayers()

  // Sort teams by points (descending)
  const sortedTeams = [...teams].sort((a, b) => b.stats.points - a.stats.points)

  // Sort players by impact score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.stats.impact - a.stats.impact)

  return (
    <div className="container py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboards</h1>
          <p className="text-muted-foreground">View team and player rankings for the JK2 CTF Tournament.</p>
        </div>
        <DataStatus />
      </div>

      <Tabs defaultValue="teams">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="teams" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Team Rankings
          </TabsTrigger>
          <TabsTrigger value="players" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Player Rankings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="teams">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">P</TableHead>
                  <TableHead className="text-right">W</TableHead>
                  <TableHead className="text-right">D</TableHead>
                  <TableHead className="text-right">L</TableHead>
                  <TableHead className="text-right">Captures</TableHead>
                  <TableHead className="text-right">Returns</TableHead>
                  <TableHead className="text-right">Kills</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTeams.map((team, index) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">
                      {index === 0 ? (
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                          {index + 1}
                        </div>
                      ) : (
                        index + 1
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{team.name}</span>
                        {index < 3 && (
                          <Badge variant="outline" className="ml-2">
                            {index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{team.stats.matchesPlayed}</TableCell>
                    <TableCell className="text-right">{team.stats.matchesWon}</TableCell>
                    <TableCell className="text-right">{team.stats.matchesDrawn}</TableCell>
                    <TableCell className="text-right">{team.stats.matchesLost}</TableCell>
                    <TableCell className="text-right">{team.stats.captures}</TableCell>
                    <TableCell className="text-right">{team.stats.flagReturns}</TableCell>
                    <TableCell className="text-right">{team.stats.kills}</TableCell>
                    <TableCell className="text-right font-medium">{team.stats.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="players">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Impact</TableHead>
                  <TableHead className="text-right">Captures</TableHead>
                  <TableHead className="text-right">Returns</TableHead>
                  <TableHead className="text-right">BC Kills</TableHead>
                  <TableHead className="text-right">Total Kills</TableHead>
                  <TableHead className="text-right">Deaths</TableHead>
                  <TableHead className="text-right">Flag Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlayers.map((player, index) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      {index === 0 ? (
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                          {index + 1}
                        </div>
                      ) : (
                        index + 1
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground">{player.team}</div>
                        </div>
                        {index === 0 && (
                          <Badge variant="secondary" className="ml-2">
                            MVP
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-jkhub">{player.stats.impact}</TableCell>
                    <TableCell className="text-right">{player.stats.flagCaptures}</TableCell>
                    <TableCell className="text-right">{player.stats.flagReturns}</TableCell>
                    <TableCell className="text-right">{player.stats.bcKills}</TableCell>
                    <TableCell className="text-right">{player.stats.overallKills}</TableCell>
                    <TableCell className="text-right">{player.stats.overallDeaths}</TableCell>
                    <TableCell className="text-right">{player.stats.flagholdTime}s</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
