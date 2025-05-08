import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPlayers } from "@/lib/data-service";

export default async function TopPlayers() {
  // Fetch players from Supabase
  const players = await getPlayers();

  // Sort players by impact score (descending)
  const topPlayers = [...players]
    .sort(
      (a, b) => (b.player_stats?.impact || 0) - (a.player_stats?.impact || 0)
    )
    .slice(0, 5);

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="bg-imperial-light/10">
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-right">Impact</TableHead>
            <TableHead className="text-right">Captures</TableHead>
            <TableHead className="text-right">Kills</TableHead>
            <TableHead className="text-right">Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topPlayers.map((player, index) => (
            <TableRow key={player.id} className="hover:bg-imperial-light/5">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {(player.name || "NN").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">
                    {player.name || "Unknown Player"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{player.team_name || "N/A"}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium text-jkhub">
                {player.player_stats?.impact || 0}
              </TableCell>
              <TableCell className="text-right">
                {player.player_stats?.flag_captures || 0}
              </TableCell>
              <TableCell className="text-right">
                {player.player_stats?.overall_kills || 0}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/players/${player.id}`}
                  className="text-sm text-jkhub hover:underline"
                >
                  View profile
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 text-center">
        <Link href="/players" className="text-sm text-jkhub hover:underline">
          View all players
        </Link>
      </div>
    </div>
  );
}
