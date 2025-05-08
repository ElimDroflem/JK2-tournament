import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMatchHistory } from "@/lib/data-service";

export default async function RecentMatches() {
  // Fetch match history from Supabase
  const matchHistory = await getMatchHistory();

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="bg-imperial-light/10">
          <TableRow>
            <TableHead>Match</TableHead>
            <TableHead>Teams</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matchHistory.slice(0, 5).map((match) => (
            <TableRow key={match.id} className="hover:bg-imperial-light/5">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      match.round.toLowerCase().includes("final")
                        ? "bg-jkhub/10 text-jkhub border-jkhub"
                        : "border-jkhub/50"
                    )}
                  >
                    {match.round}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {match.team_a_name || "N/A"} vs {match.team_b_name || "N/A"}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {match.score_a ?? 0} - {match.score_b ?? 0}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{match.date}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/matches/${match.id}`}
                  className="text-sm text-jkhub hover:underline"
                >
                  View details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 text-center">
        <Link href="/matches" className="text-sm text-jkhub hover:underline">
          View all match history
        </Link>
      </div>
    </div>
  );
}
