import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Flag, Swords, Trophy, Users } from "lucide-react"
import UpcomingMatches from "@/components/upcoming-matches"
import TeamStandings from "@/components/team-standings"
import RecentMatches from "@/components/recent-matches"
import TopPlayers from "@/components/top-players"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/jk2-banner-new.png"
              alt="JK2 Lightsaber Battle"
              fill
              className="object-cover opacity-70"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-imperial-dark"></div>
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-jkhub text-glow-jkhub">
                  JK2 Summer Tournament 2025
                </h1>
                <p className="max-w-[700px] text-gray-300 md:text-xl">
                  Welcome to the official platform for the Star Wars Jedi Knight 2: Jedi Outcast Capture The Flag
                  tournament.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/matches">
                  <Button className="bg-jkhub hover:bg-jkhub-dark text-imperial">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    View Schedule
                  </Button>
                </Link>
                <Link href="/teams">
                  <Button variant="outline" className="border-jkhub text-jkhub hover:bg-jkhub/10">
                    <Users className="mr-2 h-4 w-4" />
                    View Teams
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-jkhub text-glow-jkhub text-center mb-12">
              Tournament Status
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <Card className="border-jkhub/30 bg-imperial-dark/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-jkhub">
                    <Trophy className="mr-2 h-5 w-5" />
                    Team Standings
                  </CardTitle>
                  <CardDescription>Current tournament standings</CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamStandings />
                </CardContent>
              </Card>
              <Card className="border-jkhub/30 bg-imperial-dark/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-jkhub">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Upcoming Matches
                  </CardTitle>
                  <CardDescription>Next scheduled matches</CardDescription>
                </CardHeader>
                <CardContent>
                  <UpcomingMatches />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-imperial-light/10">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-jkhub text-glow-jkhub text-center mb-8">
              Tournament Activity
            </h2>
            <Tabs defaultValue="recent" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Latest Updates</h3>
                <TabsList className="bg-imperial-dark">
                  <TabsTrigger
                    value="recent"
                    className="flex items-center data-[state=active]:bg-jkhub data-[state=active]:text-imperial"
                  >
                    <Swords className="mr-2 h-4 w-4" />
                    Recent Matches
                  </TabsTrigger>
                  <TabsTrigger
                    value="players"
                    className="flex items-center data-[state=active]:bg-jkhub data-[state=active]:text-imperial"
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Top Players
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="recent" className="mt-0">
                <Card className="border-jkhub/30 bg-imperial-dark/50">
                  <CardContent className="pt-6">
                    <RecentMatches />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="players" className="mt-0">
                <Card className="border-jkhub/30 bg-imperial-dark/50">
                  <CardContent className="pt-6">
                    <TopPlayers />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  )
}
