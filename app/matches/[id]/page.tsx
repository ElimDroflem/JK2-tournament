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
import { CalendarDays, Clock, Shield } from "lucide-react";
import {
  getMatchById,
  getPlayers,
  MatchWithTeamNames,
  PlayerWithStatsAndTeamName,
} from "@/lib/data-service";

export default async function MatchPage({
  params,
}: {
  params: { id: string };
}) {
  const matchId = Number.parseInt(params.id);
  if (isNaN(matchId)) {
    notFound();
  }

  const match: MatchWithTeamNames | null = await getMatchById(matchId);

  // If no match is found, show a custom not found page
  if (!match) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Match Not Found</CardTitle>
            <CardDescription>
              The match you're looking for (ID: {matchId}) doesn't exist or
              hasn't been added to the database yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>This could be because:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The match ID is incorrect</li>
              <li>The match hasn't been scheduled yet</li>
              <li>The match data is still being processed</li>
            </ul>
            <div className="flex justify-start pt-4">
              <Link href="/matches">
                <Button className="bg-jkhub hover:bg-jkhub-dark text-imperial">
                  View All Matches
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPastMatch = match.is_completed;

  // Get players only if needed (for past matches, though we removed the table using them)
  // Keep this structure for now in case we add player lists back later
  // const allPlayers: PlayerWithStatsAndTeamName[] = isPastMatch ? await getPlayers() : [];
  // const matchPlayers = isPastMatch ? allPlayers.filter(
  //   (p) => p.team_id === match.team_a_id || p.team_id === match.team_b_id
  // ) : [];

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={
                    match.round.toLowerCase().includes("final")
                      ? "bg-yellow-500/10 text-yellow-500"
                      : undefined
                  }
                >
                  {match.round}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Match #{match.id}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                {match.team_a_name || "N/A"} vs {match.team_b_name || "N/A"}
              </h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <CalendarDays className="mr-2 h-4 w-4" />
                {match.date}
                {match.time && (
                  <>
                    <Clock className="ml-4 mr-2 h-4 w-4" />
                    {match.time}
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/matches">
                <Button variant="outline" size="sm">
                  All Matches
                </Button>
              </Link>
            </div>
          </div>

          {isPastMatch && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Match Result</CardTitle>
                <CardDescription>
                  Final score and match statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 py-4">
                  <div className="flex flex-col items-center">
                    <Shield className="h-8 w-8 mb-2" />
                    <h3 className="text-lg font-semibold">
                      {match.team_a_name || "N/A"}
                    </h3>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold">
                      {match.score_a ?? 0} - {match.score_b ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Final Score
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Shield className="h-8 w-8 mb-2" />
                    <h3 className="text-lg font-semibold">
                      {match.team_b_name || "N/A"}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      {match.team_a_name || "N/A"} Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Captures
                        </p>
                        <p className="text-xl font-bold">
                          {match.score_a ?? 0}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Returns</p>
                        <p className="text-xl font-bold">
                          {match.team_a_returns ?? 0}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Kills</p>
                        <p className="text-xl font-bold">
                          {match.team_a_kills ?? 0}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Flag Time
                        </p>
                        <p className="text-xl font-bold">
                          {match.team_a_flag_time ?? 0}s
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      {match.team_b_name || "N/A"} Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Captures
                        </p>
                        <p className="text-xl font-bold">
                          {match.score_b ?? 0}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Returns</p>
                        <p className="text-xl font-bold">
                          {match.team_b_returns ?? 0}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Kills</p>
                        <p className="text-xl font-bold">
                          {match.team_b_kills ?? 0}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Flag Time
                        </p>
                        <p className="text-xl font-bold">
                          {match.team_b_flag_time ?? 0}s
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Player Performance table block removed */}

          {/* Upcoming Match Card */}
          {!isPastMatch && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Match</CardTitle>
                <CardDescription>
                  This match has not been played yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center">
                      <Shield className="h-16 w-16 mb-2" />
                      <h3 className="text-xl font-semibold">
                        {match.team_a_name || "N/A"}
                      </h3>
                    </div>
                    <div className="text-2xl font-bold">vs</div>
                    <div className="flex flex-col items-center">
                      <Shield className="h-16 w-16 mb-2" />
                      <h3 className="text-xl font-semibold">
                        {match.team_b_name || "N/A"}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <CalendarDays className="h-5 w-5 mr-2" />
                    <span>{match.date}</span>
                    {match.time && (
                      <>
                        <Clock className="h-5 w-5 mr-2 ml-4" />
                        <span>{match.time}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      Match details will be updated after the game is played.
                    </p>
                    <Badge variant="outline" className="text-sm">
                      {match.round}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
