'use client'

import { useState } from 'react'
import { addDays } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePickerWithRange } from '@/components/date-range-picker'
import { RevenueVsExpensesChart } from '@/components/revenue-vs-expenses-chart'
import { ExpensesByCategoryChart } from '@/components/expenses-by-category-chart'
import { ExpenseHeatmap } from '@/components/expense-heatmap'
import { DateRange } from 'react-day-picker'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7)
  })
  const [category, setCategory] = useState('all')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <Label htmlFor="date-range">Date Range</Label>
              <DatePickerWithRange
                selected={dateRange}
                onSelect={setDateRange}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expenses">Expenses</SelectItem>
                  <SelectItem value="loans">Loans</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>Generate Report</Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueVsExpensesChart />
        <ExpensesByCategoryChart />
      </div>
      <ExpenseHeatmap />
      <Card>
        <CardHeader>
          <CardTitle>Report List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Report Name</th>
                  <th scope="col" className="px-6 py-3">Created Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">Monthly Expense Report</td>
                  <td className="px-6 py-4">2023-06-01</td>
                  <td className="px-6 py-4">Completed</td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm">Download</Button>
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">Annual Income Summary</td>
                  <td className="px-6 py-4">2023-05-15</td>
                  <td className="px-6 py-4">Pending</td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm" disabled>Download</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

