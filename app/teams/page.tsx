import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flag, Shield, Trophy, Users } from "lucide-react";
import { getTeams, getPlayers } from "@/lib/data-service";
import TeamStatsOverview from "@/components/team-stats-overview";
import DataStatus from "@/components/data-status";

export default async function TeamsPage() {
  // Fetch teams and players from Supabase
  const teams = await getTeams(); // Returns TeamWithStatsAndPlayers[]
  const players = await getPlayers(); // Returns PlayerWithStatsAndTeamName[]

  // Sort teams by points (descending)
  const sortedTeams = [...teams].sort(
    (a, b) => (b.team_stats?.points || 0) - (a.team_stats?.points || 0)
  );

  // Function to get team color class based on team name
  const getTeamColorClass = (teamName: string) => {
    if (teamName.includes("Force") || teamName.includes("Jedi")) {
      return "bg-jedi/10 border-jedi";
    } else if (teamName.includes("Sith")) {
      return "bg-sith/10 border-sith";
    } else if (teamName.includes("Beskar") || teamName.includes("Kyber")) {
      return "bg-bespin/10 border-bespin";
    } else if (teamName.includes("Rancor")) {
      return "bg-imperial/10 border-imperial";
    } else {
      return "bg-imperial/10 border-imperial";
    }
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            View all teams participating in the JK2 No More Outcasts CTF
            Tournament.
          </p>
        </div>
        <DataStatus />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <TeamStatsOverview teams={teams} />
        </div>

        <div className="lg:col-span-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTeams.map((team, index) => {
            // Get team players by filtering on team_id
            const teamPlayers = players.filter(
              (player) => player.team_id === team.id
            );
            const teamCaptain = teamPlayers.find(
              (player) => player.role === "Captain"
            );

            return (
              <Card
                key={team.id}
                className={`overflow-hidden transition-all hover:shadow-md ${getTeamColorClass(
                  team.name
                )}`}
              >
                <CardHeader className="pb-3 relative">
                  {index < 3 && (
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={
                          index === 0
                            ? "bg-yellow-500/20 text-yellow-500 border-yellow-500"
                            : index === 1
                            ? "bg-gray-300/20 text-gray-400 border-gray-400"
                            : "bg-amber-700/20 text-amber-700 border-amber-700"
                        }
                      >
                        {index === 0
                          ? "1st Place"
                          : index === 1
                          ? "2nd Place"
                          : "3rd Place"}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        team.name.includes("Force") ||
                        team.name.includes("Jedi")
                          ? "bg-jedi/20"
                          : team.name.includes("Sith")
                          ? "bg-sith/20"
                          : "bg-imperial/20"
                      }`}
                    >
                      <Shield
                        className={`h-6 w-6 ${
                          team.name.includes("Force") ||
                          team.name.includes("Jedi")
                            ? "text-jedi"
                            : team.name.includes("Sith")
                            ? "text-sith"
                            : "text-bespin"
                        }`}
                      />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {team.name}
                      </CardTitle>
                      <CardDescription>Founded: {team.founded}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between mb-4 bg-background/80 p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {team.team_stats?.matches_won || 0} Wins
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {team.team_stats?.captures || 0} Captures
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {teamPlayers.length} Players
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" /> Team Roster
                    </h4>
                    <div className="space-y-2">
                      {teamCaptain && (
                        <div className="flex items-center gap-2 p-2 bg-background/80 rounded-md">
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
                              {teamCaptain.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {teamCaptain.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Captain
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {teamPlayers
                          .filter((player) => player.role !== "Captain")
                          .slice(0, 4)
                          .map((player) => (
                            <Badge
                              key={player.id}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Avatar className="h-4 w-4">
                                <AvatarFallback className="text-[10px]">
                                  {player.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {player.name}
                            </Badge>
                          ))}
                        {teamPlayers.filter(
                          (player) => player.role !== "Captain"
                        ).length > 4 && (
                          <Badge variant="outline">
                            +
                            {teamPlayers.filter(
                              (player) => player.role !== "Captain"
                            ).length - 4}{" "}
                            more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/teams/${team.id}`} className="w-full">
                    <Button
                      variant="outline"
                      className={`w-full ${
                        team.name.includes("Force") ||
                        team.name.includes("Jedi")
                          ? "border-jedi text-jedi hover:bg-jedi/10"
                          : team.name.includes("Sith")
                          ? "border-sith text-sith hover:bg-sith/10"
                          : "border-bespin text-bespin hover:bg-bespin/10"
                      }`}
                    >
                      View Team Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
