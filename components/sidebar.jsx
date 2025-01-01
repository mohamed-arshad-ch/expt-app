"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BarChart2,
  FileText,
  Settings,
  X,
  DollarSign,
  Wallet2,
  FileIcon as FileInvoice,
  BarChart,
  BookOpen,
  TrendingUp,
  CreditCard,
} from 'lucide-react';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dash' },
  { icon: DollarSign, label: 'Income', href: '/income' },
  { icon: Wallet2, label: 'Expenses', href: '/expense' },
  { icon: FileInvoice, label: 'Invoices', href: '/invoice' },
  { icon: BarChart, label: 'Balance Sheet', href: '/balance-sheet' },
  { icon: BookOpen, label: 'Ledger', href: '/ledger' },
  { icon: TrendingUp, label: 'Profit & Loss', href: '/profit-loss' },
  { icon: CreditCard, label: 'Cash Flow', href: '/cash-flow' },
 
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is the breakpoint for md in Tailwind
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    const handleToggleSidebar = () => setIsOpen(prev => !prev)
    window.addEventListener('toggleSidebar', handleToggleSidebar)

    return () => {
      window.removeEventListener('resize', checkIsMobile)
      window.removeEventListener('toggleSidebar', handleToggleSidebar)
    };
  }, [])

  const closeSidebar = () => setIsOpen(false)

  return (<>
    {/* Sidebar */}
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out transform",
        isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
      )}>
      <div className="flex h-full flex-col">
        <div className="flex h-[60px] items-center justify-between border-b px-6">
          
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={closeSidebar} className="md:hidden">
              <X className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Close Menu</span>
            </Button>
          )}
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid gap-1 px-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={isMobile ? closeSidebar : undefined}>
                  <span
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                      pathname === item.href ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-50" : ""
                    )}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
    {/* Overlay for Mobile */}
    {isOpen && isMobile && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={closeSidebar} />
    )}
  </>);
}

