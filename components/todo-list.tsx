"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Task {
  id: string
  title: string
  completed: boolean
}

export function TodoList({ userId }: { userId: string }) {
  const router = useRouter()
  const [newTask, setNewTask] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask, userId }),
      })

      if (response.ok) {
        const task = await response.json()
        setTasks([...tasks, task])
        setNewTask("")
      }
    } catch (error) {
      console.error("Failed to add task:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId))
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addTask} className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="bg-white"
        />
        <Button type="submit" className="bg-[#964734] hover:bg-[#964734]/90">
          Add Task
        </Button>
      </form>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <span className="text-[#024950]">{task.title}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/edit/${task.id}`)}
                className="text-[#0FA4AF] hover:text-[#0FA4AF]/90"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
                className="text-[#964734] hover:text-[#964734]/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

