import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Flag, Shield, Swords, Users } from "lucide-react";
import {
  getPlayerById,
  getMatchHistory,
  PlayerWithStatsAndTeamName,
  MatchWithTeamNames,
} from "@/lib/data-service";

export default async function PlayerPage({
  params,
}: {
  params: { id: string };
}) {
  const playerId = Number.parseInt(params.id);
  if (isNaN(playerId)) {
    notFound();
  }
  const player: PlayerWithStatsAndTeamName | null = await getPlayerById(
    playerId
  );

  if (!player) {
    notFound();
  }

  // Get player's match history
  const allMatches: MatchWithTeamNames[] = await getMatchHistory();
  const playerMatches = allMatches.filter(
    (match) =>
      match.team_a_id === player.team_id || match.team_b_id === player.team_id
  );

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">
                  {(player.name || "NN").substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {player.name || "Unknown Player"}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shield className="h-3 w-3 mr-1" />
                    {player.team_name || "N/A"}
                  </Badge>
                  {player.role && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {player.role}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/players">
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  All Players
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Flag Captures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {player.player_stats?.flag_captures || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Flag Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {player.player_stats?.flag_returns || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Kills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {player.player_stats?.overall_kills || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">K/D Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    (player.player_stats?.overall_kills || 0) /
                    Math.max(1, player.player_stats?.overall_deaths || 0)
                  ).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="stats">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stats" className="flex items-center">
                <Flag className="mr-2 h-4 w-4" />
                Detailed Stats
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex items-center">
                <Swords className="mr-2 h-4 w-4" />
                Match History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Player Statistics</CardTitle>
                  <CardDescription>
                    Detailed performance metrics for {player.name || "Player"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Flag Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Flag Captures
                          </p>
                          <p className="text-xl font-bold">
                            {player.player_stats?.flag_captures || 0}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Flag Returns
                          </p>
                          <p className="text-xl font-bold">
                            {player.player_stats?.flag_returns || 0}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Flag Hold Time
                          </p>
                          <p className="text-xl font-bold">
                            {player.player_stats?.flaghold_time || 0}s
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Combat Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Total Kills
                          </p>
                          <p className="text-xl font-bold">
                            {player.player_stats?.overall_kills || 0}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Total Deaths
                          </p>
                          <p className="text-xl font-bold">
                            {player.player_stats?.overall_deaths || 0}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            BC Kills
                          </p>
                          <p className="text-xl font-bold">
                            {player.player_stats?.bc_kills || 0}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            DBS Kills
                          </p>
                          <p className="text-xl font-bold">
                            {player.player_stats?.dbs_kills || 0}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            DFA Kills
                          </p>
                          <p className="text-xl font-bold">
                            {player.player_stats?.dfa_kills || 0}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            K/D Ratio
                          </p>
                          <p className="text-xl font-bold">
                            {(
                              (player.player_stats?.overall_kills || 0) /
                              Math.max(
                                1,
                                player.player_stats?.overall_deaths || 0
                              )
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="matches" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Match History</CardTitle>
                  <CardDescription>
                    Matches played by {player.name || "Player"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {playerMatches.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Match</TableHead>
                          <TableHead>Teams</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {playerMatches.map((match) => {
                          const isTeamA = match.team_a_id === player.team_id;
                          const opponentName = isTeamA
                            ? match.team_b_name
                            : match.team_a_name;
                          const teamScore = match.score_a ?? 0;
                          const opponentScore = match.score_b ?? 0;
                          const result =
                            teamScore > opponentScore
                              ? "Win"
                              : teamScore < opponentScore
                              ? "Loss"
                              : "Draw";

                          return (
                            <TableRow key={match.id}>
                              <TableCell>
                                <Badge variant="outline">{match.round}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {player.team_name || "N/A"} vs{" "}
                                  {opponentName || "N/A"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    result === "Win"
                                      ? "outline"
                                      : result === "Loss"
                                      ? "destructive"
                                      : "outline"
                                  }
                                  className={
                                    result === "Win"
                                      ? "bg-green-500/10 text-green-500 border-green-700"
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
                              <TableCell className="text-right">
                                <Link href={`/matches/${match.id}`}>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">
                      No match history available.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
