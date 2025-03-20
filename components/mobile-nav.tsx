"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Vote } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
            <Vote className="h-6 w-6" />
            <span className="font-bold">CryptoVote</span>
          </Link>
        </div>
        <div className="flex flex-col space-y-3 p-7">
          <Link
            href="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
            )}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/proposals"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname?.startsWith("/proposals") ? "text-foreground" : "text-foreground/60",
            )}
            onClick={() => setOpen(false)}
          >
            Proposals
          </Link>
          <Link
            href="/admin"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname?.startsWith("/admin") ? "text-foreground" : "text-foreground/60",
            )}
            onClick={() => setOpen(false)}
          >
            Admin
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

