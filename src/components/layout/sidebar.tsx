"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Library, LayoutDashboard, BookCopy, Tags, Users } from "lucide-react"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/books", label: "Books", icon: BookCopy },
  { href: "/categories", label: "Categories", icon: Tags },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const items = [...navItems]
  if (session?.user?.role === "admin") {
    items.push({ href: "/users", label: "Users", icon: Users })
  }

  return (
    <div className="hidden border-r bg-muted/40 md:flex md:w-64 md:flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Library className="h-6 w-6 text-primary" />
          <span className="">LibrarySys</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {items.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive ? "bg-muted text-primary" : ""
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
