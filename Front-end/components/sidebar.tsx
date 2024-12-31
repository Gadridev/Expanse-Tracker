'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PieChart, DollarSign, Settings } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: PieChart, label: 'Reports', href: '/reports' },
  { icon: DollarSign, label: 'Transactions', href: '/transactions' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card text-card-foreground border-r h-full flex-shrink-0">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-2xl font-semibold">FinanceDash</span>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              pathname === item.href ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

