"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState({ title: "" })

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
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  return (
    <div className="min-h-screen bg-[#AFDDE5] p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-[#003135]">Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateTask} className="space-y-4">
            <Input
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="bg-white"
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-[#964734] hover:bg-[#964734]/90">
                Update Task
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

