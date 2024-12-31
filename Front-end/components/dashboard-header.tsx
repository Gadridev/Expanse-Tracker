'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    // Implement logout logic here
    router.push('/login')
  }

  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </header>
  )
}

