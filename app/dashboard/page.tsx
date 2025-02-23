"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { TodoList } from "@/components/todo-list"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function DashboardPage() {
  const { data: session } = useSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Welcome, {session.user.name}</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>
        <TodoList userId={session.user.id} />
      </div>
    </div>
  )
}

