import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Flag, Trophy, Calendar } from "lucide-react"

export default function RulesPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rules & Information</h1>
          <p className="text-muted-foreground">Official rules and information for the JK2 Summer Tournament 2025.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Tournament Overview
            </CardTitle>
            <CardDescription>Basic tournament information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Game Mode: Capture the Flag (CTF)</li>
              <li>Map: CTF_Yavin_No_Outside</li>
              <li>Team Size: 7 players (6 active, 1 substitute)</li>
              <li>Game Format: First to 7 caps, 60 minute time limit.</li>
              <li>Maximum Players: ~50 total (7 - 8 teams?)</li>
              <li>
                Communication: Teams must use Discord for microphone comms or in-game team chat commands if microphones
                aren't available.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Team Creation
            </CardTitle>
            <CardDescription>Process for creating balanced teams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">To ensure fair and balanced teams, we'll follow this process:</p>
            <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
              <li>Player Registration: Players will have two weeks to register for the tournament</li>
              <li>
                Team Building:
                <ul className="list-disc pl-5 mt-1 mb-1">
                  <li>Admins will create balanced teams and share with players to confer</li>
                  <li>
                    Players can list up to 3 people they don't want to team with and 1-2 players they'd prefer to team
                    with. [TBC]
                  </li>
                </ul>
              </li>
              <li>
                Role Rotation: Players may not play the same position in consecutive games, ensuring variety and
                adaptability within teams. [TOO STRICT?]
              </li>
              <li>
                Transparency: Admins will share team proposals with the community for feedback before finalizing them.
              </li>
              <li>Team Identity: Teams must choose a name, clan tag, and team colours/logo for a custom skin.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Tournament Format
            </CardTitle>
            <CardDescription>Structure of the tournament</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                Group Stage: All teams will compete in a single round-robin group. Each team will play every other team
                twice [FEELS BEST GIVEN SMALL COMMUNITY?].
              </li>
              <li>
                Semi-Finals and Finals: The top four teams from the group stage will advance.
                <ul className="list-disc pl-5 mt-1 mb-1">
                  <li>Semi-Finals: 1st vs. 3rd and 2nd vs. 4th.</li>
                  <li>Finals: Winners of the semi-finals will face off for the championship.</li>
                </ul>
              </li>
              <li>
                Tiebreakers: If two teams tie during the group stage, rankings will be determined by:
                <ol className="list-decimal pl-5 mt-1 mb-1">
                  <li>Total captures scored.</li>
                  <li>Total captures conceded.</li>
                  <li>A sudden-death playoff game if necessary.</li>
                  <li>TBC</li>
                </ol>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              CHAMPIONS LEAGUE
            </CardTitle>
            <CardDescription>Special final event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Players will be given an Impact Score from 2 to 14 based on their performance in a game.</li>
              <li>
                Impact Scores are given per team (so, 7 players on each team will each be ranked 2, 4, 6, 8, 10, 12 or
                14)
              </li>
              <li>
                At the end of the tourney, the top 14 players on the leaderboard will be arranged into two balanced
                teams for a final Champions League showdown. [TBC TBC TBC]
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flag className="mr-2 h-5 w-5" />
              Game Day Rules
            </CardTitle>
            <CardDescription>Rules for match day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                Gameplay:
                <ul className="list-disc pl-5 mt-1 mb-1">
                  <li>
                    Games will continue for 60 minutes or until one team scores 7 flag captures. Semi final and final
                    matches will have no time limit.
                  </li>
                </ul>
              </li>
              <li>Substitutions: Teams may rotate substitutes every 15 minutes. [DOES THIS WORK?]</li>
              <li>Pauses: Teams get a maximum of one pause per match, apart from subs.</li>
              <li>
                Game Resets: Each team is allowed up to 1 reset per game (e.g., due to a disconnect). Flags must be
                dropped, and all players must reset to their spawn points. [MAYBE? COULD ENCOURAGE FOUL PLAY]
              </li>
              <li>
                Behavior:
                <ul className="list-disc pl-5 mt-1 mb-1">
                  <li>No scripting, cheats, or toxic behavior.</li>
                  <li>If a player ragequits, they will miss the next game.</li>
                  <li>If an entire team ragequits, the match is forfeited.</li>
                </ul>
              </li>
              <li>
                Referees: Referees will monitor games in spectator mode, enforce rules, and record gameplay if disputes
                arise.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Prizes
            </CardTitle>
            <CardDescription>Tournament rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Winners: $20 per player, an exclusive Yavin texture map, and an exclusive player skin. [TBC]</li>
              <li>Runners-Up: $5 per player. [TBC]</li>
              <li>
                Participation: All players receive a team skin — a base player model in their team's colours. [TBC]
              </li>
              <li>
                Best Tournament Movie: Teams can submit gameplay highlight videos for a bonus prize. [WOULD BE COOL]
              </li>
              <li>
                Individual Awards: Special recognition for players in categories like Best Capper, Best Base Cleaner,
                Best Support, Best Team Player, and more
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Other Details
            </CardTitle>
            <CardDescription>Additional tournament information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Warm-Ups: Each team has an optional 10-minute warm-up session before their match.</li>
              <li>
                Position Assignments: Teams must submit their initial player positions before each game, along with
                backup plans for role adjustments. [TOO STRICT?]
              </li>
              <li>
                Highlight Reels: Teams and referees are encouraged to clip gameplay for community highlight reels.
              </li>
              <li>Feedback Loop: During the tournament, we'll collect feedback to make games even better.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Communications Hosting Options
            </CardTitle>
            <CardDescription>Tournament communication channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This platform will be online for all tournament comms. Both discord servers will also relay information
              and host conversations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
