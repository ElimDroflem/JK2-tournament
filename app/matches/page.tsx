import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMatchHistory, getUpcomingMatches } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  // Fetch match data from Supabase
  const matchHistory = await getMatchHistory();
  const upcomingMatches = await getUpcomingMatches();

  return (
    <div className="container py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
          <p className="text-muted-foreground">
            View all matches in the JK2 CTF Tournament.
          </p>
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
          <TabsTrigger value="history">Match History</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches.map((match) => (
              <Link key={match.id} href={`/matches/${match.id}`}>
                <Card className="overflow-hidden transition-colors hover:bg-muted/50 h-full">
                  <CardContent className="p-0">
                    <div className="grid items-start gap-4 p-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize",
                              match.round.toLowerCase().includes("final") &&
                                "bg-yellow-500/10 text-yellow-500"
                            )}
                          >
                            {match.round}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Match #{match.order || match.id}
                          </span>
                        </div>
                        <div className="text-xl font-semibold">
                          {match.team_a_name || "TBD"} vs{" "}
                          {match.team_b_name || "TBD"}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matchHistory.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            match.round.toLowerCase().includes("final") &&
                              "bg-yellow-500/10 text-yellow-500"
                          )}
                        >
                          {match.round}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Match #{match.order || match.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {match.team_a_name || "TBD"} vs{" "}
                        {match.team_b_name || "TBD"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {match.score_a ?? 0} - {match.score_b ?? 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/matches/${match.id}`}>
                        <Button variant="outline" size="sm">
                          View details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
