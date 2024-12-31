import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText, RefreshCw } from 'lucide-react'

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
        <Button className="w-full" variant="outline">
          <FileText className="mr-2 h-4 w-4" /> Generate Report
        </Button>
        <Button className="w-full" variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Sync Accounts
        </Button>
      </CardContent>
    </Card>
  )
}

