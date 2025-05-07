"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Flag, Menu, Shield, Swords, Trophy, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const routes = [
  {
    name: "Home",
    path: "/",
    icon: null,
  },
  {
    name: "Teams",
    path: "/teams",
    icon: <Users className="h-4 w-4 mr-2" />,
  },
  {
    name: "Leaderboards",
    path: "/leaderboards",
    icon: <Trophy className="h-4 w-4 mr-2" />,
  },
  {
    name: "Matches",
    path: "/matches",
    icon: <Swords className="h-4 w-4 mr-2" />,
  },
  {
    name: "Players",
    path: "/players",
    icon: <Flag className="h-4 w-4 mr-2" />,
  },
  {
    name: "Rules",
    path: "/rules",
    icon: <Shield className="h-4 w-4 mr-2" />,
  },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-jkhub/20 bg-imperial-dark backdrop-blur supports-[backdrop-filter]:bg-imperial-dark/90">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/images/jk2-logo-new.png" alt="JK2 Logo" width={24} height={24} className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block text-jkhub text-glow-jkhub">
              JK2 Summer Tournament 2025
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "transition-colors hover:text-jkhub",
                  pathname === route.path ? "text-jkhub text-glow-jkhub" : "text-gray-300",
                )}
              >
                <div className="flex items-center">
                  {route.icon}
                  {route.name}
                </div>
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden border-jkhub text-jkhub">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-imperial-dark text-white border-jkhub pr-0">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <Image src="/images/jk2-logo-new.png" alt="JK2 Logo" width={24} height={24} className="h-6 w-6" />
              <span className="font-bold text-jkhub text-glow-jkhub">JK2 Summer Tournament 2025</span>
            </Link>
            <nav className="grid gap-4 text-lg font-medium">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center py-2 transition-colors hover:text-jkhub",
                    pathname === route.path ? "text-jkhub text-glow-jkhub" : "text-gray-300",
                  )}
                >
                  {route.icon}
                  {route.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
              <Image src="/images/jk2-logo-new.png" alt="JK2 Logo" width={24} height={24} className="h-6 w-6" />
              <span className="font-bold inline-block text-jkhub text-glow-jkhub">JK2 Summer Tournament 2025</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
