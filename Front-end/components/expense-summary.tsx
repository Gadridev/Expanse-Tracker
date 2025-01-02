'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

export function ExpenseSummary() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('/api/expenses')
        if (!response.ok) {
          throw new Error('Failed to fetch expenses')
        }
        const data = await response.json()
        setExpenses(data)
      } catch (err) {
        setError('Failed to load expenses')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpenses()
  }, [])
  console.log(expenses)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const previousMonthExpenses = 1000 // This should be calculated or fetched
  const percentageChange = ((totalExpenses - previousMonthExpenses) / previousMonthExpenses) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Total Expenses This Month</p>
          </div>
          <div className={`flex items-center ${percentageChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentageChange < 0 ? (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(percentageChange).toFixed(1)}% vs Last Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

