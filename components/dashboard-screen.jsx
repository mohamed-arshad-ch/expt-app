import { ArrowDownIcon, ArrowUpIcon, DollarSign, FileText, PlusCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Dummy data for demonstration
const keyMetrics = {
  totalIncome: 50000,
  totalExpense: 30000,
  netProfit: 20000,
}

const recentTransactions = [
  { id: 1, date: "2023-05-01", description: "Client Payment", amount: 5000, type: "income" },
  { id: 2, date: "2023-05-02", description: "Office Rent", amount: -2000, type: "expense" },
  { id: 3, date: "2023-05-03", description: "Equipment Purchase", amount: -1500, type: "expense" },
  { id: 4, date: "2023-05-04", description: "Consulting Fee", amount: 3000, type: "income" },
  { id: 5, date: "2023-05-05", description: "Utility Bill", amount: -500, type: "expense" },
]

export default function DashboardScreen() {
  return (
    (<div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Income"
          value={keyMetrics.totalIncome}
          icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />} />
        <MetricCard
          title="Total Expense"
          value={keyMetrics.totalExpense}
          icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />} />
        <MetricCard
          title="Net Profit"
          value={keyMetrics.netProfit}
          icon={<DollarSign className="h-4 w-4 text-blue-500" />} />
      </div>
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Income
        </Button>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
        <Button>
          <FileText className="mr-2 h-4 w-4" /> Generate Invoice
        </Button>
        <Button>
          <FileText className="mr-2 h-4 w-4" /> View Reports
        </Button>
      </div>
      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>)
  );
}

function MetricCard({
  title,
  value,
  icon
}) {
  return (
    (<Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${value.toLocaleString()}</div>
      </CardContent>
    </Card>)
  );
}

