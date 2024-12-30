'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
  ]

  return (
    <nav className="mb-8">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`mr-4 ${
            pathname === item.path ? 'text-blue-500' : 'text-gray-500'
          } hover:text-blue-700`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

export default Navigation

