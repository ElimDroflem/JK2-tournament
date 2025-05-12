import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPlayers } from "@/lib/data-service";
import DataStatus from "@/components/data-status";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  // Fetch players from Supabase
  const players = await getPlayers();
  // Sort players by impact descending
  const sortedPlayers = [...players].sort(
    (a, b) => (b.player_stats?.impact || 0) - (a.player_stats?.impact || 0)
  );

  return (
    <div className="container py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Players</h1>
          <p className="text-muted-foreground">
            View all players participating in the JK2 CTF Tournament.
          </p>
        </div>
        <div className="w-full md:w-auto flex items-center gap-4">
          <Input
            placeholder="Search players..."
            className="w-full md:w-[250px]"
          />
          <DataStatus />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Impact</TableHead>
              <TableHead className="text-right">Captures</TableHead>
              <TableHead className="text-right">Returns</TableHead>
              <TableHead className="text-right">Kills</TableHead>
              <TableHead className="text-right">Deaths</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers && sortedPlayers.length > 0 ? (
              sortedPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {player.name
                            ? player.name.substring(0, 2).toUpperCase()
                            : "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">
                        {player.name || "Unknown Player"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {player.team_name || "Unknown Team"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-jkhub">
                    {player.player_stats?.impact || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    {player.player_stats?.flag_captures || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    {player.player_stats?.flag_returns || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    {player.player_stats?.overall_kills || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    {player.player_stats?.overall_deaths || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/players/${player.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No players found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
