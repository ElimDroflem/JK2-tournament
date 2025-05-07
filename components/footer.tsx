import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="w-full border-t border-jkhub/20 py-6 md:py-0 bg-imperial-dark text-white">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <Image src="/images/jk2-logo-new.png" alt="JK2 Logo" width={20} height={20} className="h-5 w-5" />
          <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} JK2 Summer Tournament 2025</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/rules" className="text-sm text-gray-300 hover:text-jkhub hover:underline">
            Rules
          </Link>
          <Link href="#" className="text-sm text-gray-300 hover:text-jkhub hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
