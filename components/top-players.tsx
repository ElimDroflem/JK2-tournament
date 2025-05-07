import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getPlayers } from "@/lib/data-service"

export default async function TopPlayers() {
  // Fetch players from Supabase
  const players = await getPlayers()

  // Sort players by impact score (descending)
  const topPlayers = [...players].sort((a, b) => b.stats.impact - a.stats.impact).slice(0, 5)

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
                    <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{player.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{player.team}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium text-jkhub">{player.stats.impact}</TableCell>
              <TableCell className="text-right">{player.stats.flagCaptures}</TableCell>
              <TableCell className="text-right">{player.stats.overallKills}</TableCell>
              <TableCell className="text-right">
                <Link href={`/players/${player.id}`} className="text-sm text-jkhub hover:underline">
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
  )
}
