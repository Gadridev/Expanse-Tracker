import { ExpenseSummary } from '@/components/expense-summary'
import { BudgetOverview } from '@/components/budget-overview'
import { RecentTransactions } from '@/components/recent-transactions'
import { ExpenseBreakdown } from '@/components/expense-breakdown'
import { AddExpenseForm } from '@/components/add-expense-form'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseSummary />
        <BudgetOverview />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentTransactions />
        <ExpenseBreakdown />
      </div>
      <AddExpenseForm />
    </div>
  )
}

