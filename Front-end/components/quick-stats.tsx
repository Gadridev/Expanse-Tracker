import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, CreditCard, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const stats = [
  { title: 'Total Revenue', value: '$45,231.89', icon: DollarSign, change: 20.1, increasing: true },
  { title: 'Monthly Expenses', value: '$12,234.56', icon: CreditCard, change: 8.2, increasing: false },
  { title: 'Pending Transactions', value: '23', icon: Users, change: 5.1, increasing: true },
]

export function QuickStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.increasing ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 inline mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 inline mr-1" />
              )}
              <span className={stat.increasing ? 'text-green-500' : 'text-red-500'}>
                {stat.change}%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

