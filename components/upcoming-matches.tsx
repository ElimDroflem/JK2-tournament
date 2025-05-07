import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUpcomingMatches } from "@/lib/data-service"

export default async function UpcomingMatches() {
  // Fetch upcoming matches from Supabase
  const upcomingMatches = await getUpcomingMatches()

  return (
    <div className="space-y-4">
      {upcomingMatches.slice(0, 3).map((match) => (
        <Link key={match.id} href={`/matches/${match.id}`}>
          <Card className="overflow-hidden transition-colors hover:bg-imperial-light/5 border-jkhub/30 hover:border-jkhub hover:border-glow-jkhub">
            <CardContent className="p-0">
              <div className="grid grid-cols-[1fr_auto] items-start gap-4 p-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        match.round.toLowerCase().includes("final")
                          ? "bg-jkhub/10 text-jkhub border-jkhub"
                          : "border-jkhub/50 text-gray-300",
                      )}
                    >
                      {match.round}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Match #{match.id}</span>
                  </div>
                  <div className="font-semibold">
                    {match.teamA} vs {match.teamB}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {match.date}
                    <Clock className="ml-3 mr-1 h-3 w-3" />
                    {match.time}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      <div className="text-center">
        <Link href="/matches" className="text-sm text-jkhub hover:underline">
          View all upcoming matches
        </Link>
      </div>
    </div>
  )
}
