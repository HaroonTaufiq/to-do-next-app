"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft } from "lucide-react"

export default function EditTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState({ title: "" })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setTask(data)
        }
      } catch (error) {
        console.error("Failed to fetch task:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTask()
  }, [params.id])

  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task.title }),
      })

      if (response.ok) {
        router.back()
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <ThemeToggle />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateTask} className="space-y-4">
              <Input
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                placeholder="Task title"
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

