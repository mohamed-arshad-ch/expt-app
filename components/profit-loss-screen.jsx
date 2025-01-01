import { useState } from 'react'
import { format } from 'date-fns'
import { Download, TrendingUp, TrendingDown } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Dummy data for the Profit & Loss Statement
const profitLossData = {
  revenue: [
    { category: 'Sales', amount: 100000 },
    { category: 'Service Income', amount: 50000 },
    { category: 'Other Income', amount: 5000 },
  ],
  expenses: [
    { category: 'Cost of Goods Sold', amount: 60000 },
    { category: 'Salaries', amount: 40000 },
    { category: 'Rent', amount: 10000 },
    { category: 'Utilities', amount: 5000 },
    { category: 'Marketing', amount: 7000 },
    { category: 'Other Expenses', amount: 3000 },
  ],
}

const periods = ['Last Month', 'Last Quarter', 'Year to Date', 'Last Year']

export default function ProfitLossScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Last Month')

  const totalRevenue = profitLossData.revenue.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = profitLossData.expenses.reduce((sum, item) => sum + item.amount, 0)
  const netProfit = totalRevenue - totalExpenses

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Profit & Loss Statement', 14, 15)
    doc.text(`Period: ${selectedPeriod}`, 14, 25)
    doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 14, 35)

    const revenueData = profitLossData.revenue.map(item => [item.category, `$${item.amount.toLocaleString()}`])
    revenueData.push(['Total Revenue', `$${totalRevenue.toLocaleString()}`])

    const expensesData = profitLossData.expenses.map(item => [item.category, `$${item.amount.toLocaleString()}`])
    expensesData.push(['Total Expenses', `$${totalExpenses.toLocaleString()}`])

    doc.autoTable({
      head: [['Revenue', 'Amount']],
      body: revenueData,
      startY: 45,
    })

    doc.autoTable({
      head: [['Expenses', 'Amount']],
      body: expensesData,
      startY: doc.lastAutoTable.finalY + 10,
    })

    doc.text(
      `Net Profit/Loss: $${netProfit.toLocaleString()}`,
      14,
      doc.lastAutoTable.finalY + 20
    )

    doc.save('profit_and_loss.pdf')
  }

  const handleDownloadExcel = () => {
    const revenueData = profitLossData.revenue.map(item => ({ Category: item.category, Amount: item.amount }))
    revenueData.push({ Category: 'Total Revenue', Amount: totalRevenue })

    const expensesData = profitLossData.expenses.map(item => ({ Category: item.category, Amount: item.amount }))
    expensesData.push({ Category: 'Total Expenses', Amount: totalExpenses })

    const ws = XLSX.utils.json_to_sheet([
      { Category: 'Profit & Loss Statement' },
      { Category: `Period: ${selectedPeriod}` },
      { Category: `Generated on ${format(new Date(), 'MMMM d, yyyy')}` },
      { Category: 'Revenue' },
      ...revenueData,
      { Category: 'Expenses' },
      ...expensesData,
      { Category: 'Net Profit/Loss', Amount: netProfit }
    ])

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Profit & Loss')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob(
      [excelBuffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    )
    
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(data)
    link.download = 'profit_and_loss.xlsx'
    link.click()
  }

  return (
    (<div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Profit & Loss Statement</h1>
        <div
          className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period} value={period}>{period}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleDownloadPDF} className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button onClick={handleDownloadExcel} className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" /> Excel
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              {profitLossData.revenue.map((item) => (
                <div key={item.category} className="flex justify-between">
                  <dt>{item.category}</dt>
                  <dd className="font-medium">${item.amount.toLocaleString()}</dd>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t">
                <dt>Total Revenue</dt>
                <dd>${totalRevenue.toLocaleString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              {profitLossData.expenses.map((item) => (
                <div key={item.category} className="flex justify-between">
                  <dt>{item.category}</dt>
                  <dd className="font-medium">${item.amount.toLocaleString()}</dd>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t">
                <dt>Total Expenses</dt>
                <dd>${totalExpenses.toLocaleString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Net Profit/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div
              className={`text-4xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netProfit >= 0 ? (
                <TrendingUp className="inline-block mr-2 h-8 w-8" />
              ) : (
                <TrendingDown className="inline-block mr-2 h-8 w-8" />
              )}
              ${Math.abs(netProfit).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>)
  );
}

