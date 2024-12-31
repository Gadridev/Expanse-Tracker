import { QuickStats } from '@/components/quick-stats'
import { ActivityFeed } from '@/components/activity-feed'
import { RevenueChart } from '@/components/revenue-chart'
import { ExpensesChart } from '@/components/expenses-chart'
import { ExpenseCategoriesChart } from '@/components/expense-categories-chart'
import { QuickActions } from '@/components/quick-actions'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <QuickStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityFeed />
        <QuickActions />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <ExpensesChart />
        <ExpenseCategoriesChart />
      </div>
    </div>
  )
}

