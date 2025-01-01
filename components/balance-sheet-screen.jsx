import { useState } from 'react'
import { format } from 'date-fns'
import { Download } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Dummy data for the balance sheet
const balanceSheetData = {
  assets: [
    { name: 'Cash and Cash Equivalents', amount: 100000 },
    { name: 'Accounts Receivable', amount: 50000 },
    { name: 'Inventory', amount: 75000 },
    { name: 'Prepaid Expenses', amount: 10000 },
    { name: 'Property, Plant, and Equipment', amount: 200000 },
  ],
  liabilities: [
    { name: 'Accounts Payable', amount: 30000 },
    { name: 'Short-term Debt', amount: 50000 },
    { name: 'Accrued Expenses', amount: 15000 },
    { name: 'Long-term Debt', amount: 100000 },
  ],
  equity: [
    { name: 'Common Stock', amount: 150000 },
    { name: 'Retained Earnings', amount: 90000 },
  ],
}

export default function BalanceSheetScreen() {
  const [period, setPeriod] = useState('current')

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.amount, 0);
  }

  const totalAssets = calculateTotal(balanceSheetData.assets)
  const totalLiabilities = calculateTotal(balanceSheetData.liabilities)
  const totalEquity = calculateTotal(balanceSheetData.equity)

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Balance Sheet', 14, 15)
    doc.text(`As of ${format(new Date(), 'MMMM d, yyyy')}`, 14, 25)

    const tableData = [
      ...balanceSheetData.assets.map(item => ['Assets', item.name, `$${item.amount.toLocaleString()}`]),
      ['Assets', 'Total Assets', `$${totalAssets.toLocaleString()}`],
      ...balanceSheetData.liabilities.map(item => ['Liabilities', item.name, `$${item.amount.toLocaleString()}`]),
      ['Liabilities', 'Total Liabilities', `$${totalLiabilities.toLocaleString()}`],
      ...balanceSheetData.equity.map(item => ['Equity', item.name, `$${item.amount.toLocaleString()}`]),
      ['Equity', 'Total Equity', `$${totalEquity.toLocaleString()}`],
      ['', 'Total Liabilities and Equity', `$${(totalLiabilities + totalEquity).toLocaleString()}`],
    ]

    doc.autoTable({
      head: [['Category', 'Item', 'Amount']],
      body: tableData,
      startY: 35,
    })

    doc.save('balance_sheet.pdf')
  }

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      ...balanceSheetData.assets.map(item => ({ Category: 'Assets', Item: item.name, Amount: item.amount })),
      { Category: 'Assets', Item: 'Total Assets', Amount: totalAssets },
      ...balanceSheetData.liabilities.map(
        item => ({ Category: 'Liabilities', Item: item.name, Amount: item.amount })
      ),
      { Category: 'Liabilities', Item: 'Total Liabilities', Amount: totalLiabilities },
      ...balanceSheetData.equity.map(item => ({ Category: 'Equity', Item: item.name, Amount: item.amount })),
      { Category: 'Equity', Item: 'Total Equity', Amount: totalEquity },
      { Category: '', Item: 'Total Liabilities and Equity', Amount: totalLiabilities + totalEquity },
    ])

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Balance Sheet')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob(
      [excelBuffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    )
    
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(data)
    link.download = 'balance_sheet.xlsx'
    link.click()
  }

  return (
    (<div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Balance Sheet</h1>
        <div
          className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Period</SelectItem>
              <SelectItem value="previous">Previous Period</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Button onClick={handleDownloadPDF} className="flex-1 sm:flex-none">
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button onClick={handleDownloadExcel} className="flex-1 sm:flex-none">
              <Download className="mr-2 h-4 w-4" /> Excel
            </Button>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet as of {format(new Date(), 'MMMM d, yyyy')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Item</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="font-medium">
                <TableCell>Assets</TableCell>
                <TableCell className="text-right">${totalAssets.toLocaleString()}</TableCell>
              </TableRow>
              {balanceSheetData.assets.map((asset, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-8">{asset.name}</TableCell>
                  <TableCell className="text-right">${asset.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell>Liabilities</TableCell>
                <TableCell className="text-right">${totalLiabilities.toLocaleString()}</TableCell>
              </TableRow>
              {balanceSheetData.liabilities.map((liability, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-8">{liability.name}</TableCell>
                  <TableCell className="text-right">${liability.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell>Equity</TableCell>
                <TableCell className="text-right">${totalEquity.toLocaleString()}</TableCell>
              </TableRow>
              {balanceSheetData.equity.map((equityItem, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-8">{equityItem.name}</TableCell>
                  <TableCell className="text-right">${equityItem.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell>Total Liabilities and Equity</TableCell>
                <TableCell className="text-right">${(totalLiabilities + totalEquity).toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>)
  );
}

