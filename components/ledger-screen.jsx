"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import { Download, Search } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

// Dummy data for the ledger
const ledgerData = [
  { id: 1, date: "2023-06-01", account: "Cash", type: "Asset", description: "Initial balance", debit: 10000, credit: 0 },
  { id: 2, date: "2023-06-02", account: "Accounts Receivable", type: "Asset", description: "Invoice #1001", debit: 5000, credit: 0 },
  { id: 3, date: "2023-06-03", account: "Sales Revenue", type: "Income", description: "Service rendered", debit: 0, credit: 5000 },
  { id: 4, date: "2023-06-04", account: "Office Supplies", type: "Expense", description: "Stationery purchase", debit: 200, credit: 0 },
  { id: 5, date: "2023-06-05", account: "Accounts Payable", type: "Liability", description: "Supplier invoice", debit: 0, credit: 1000 },
  { id: 6, date: "2023-06-06", account: "Cash", type: "Asset", description: "Client payment", debit: 3000, credit: 0 },
  { id: 7, date: "2023-06-07", account: "Accounts Receivable", type: "Asset", description: "Invoice #1002", debit: 4000, credit: 0 },
  { id: 8, date: "2023-06-08", account: "Salaries", type: "Expense", description: "Monthly payroll", debit: 7000, credit: 0 },
  { id: 9, date: "2023-06-09", account: "Cash", type: "Asset", description: "Loan repayment", debit: 0, credit: 2000 },
  { id: 10, date: "2023-06-10", account: "Sales Revenue", type: "Income", description: "Product sales", debit: 0, credit: 6000 },
]

const accountTypes = ["All", "Asset", "Liability", "Income", "Expense"]

export default function LedgerScreen() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [accountType, setAccountType] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const handleDateChange = (e) => {
    const { name, value } = e.target
    if (name === "startDate") setStartDate(value)
    if (name === "endDate") setEndDate(value)
  }

  const filteredLedger = ledgerData.filter(entry => {
    const entryDate = new Date(entry.date)
    const matchesDateRange = 
      (!startDate || entryDate >= new Date(startDate)) &&
      (!endDate || entryDate <= new Date(endDate))
    const matchesAccountType = accountType === "All" || entry.type === accountType
    const matchesSearch = entry.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesDateRange && matchesAccountType && matchesSearch
  })

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Ledger', 14, 15)
    doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 14, 25)

    doc.autoTable({
      head: [['Date', 'Account', 'Type', 'Description', 'Debit', 'Credit']],
      body: filteredLedger.map(entry => [
        format(new Date(entry.date), 'MMM dd, yyyy'),
        entry.account,
        entry.type,
        entry.description,
        entry.debit.toLocaleString(),
        entry.credit.toLocaleString()
      ]),
      startY: 35,
    })

    doc.save('ledger.pdf')
  }

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLedger.map(entry => ({
      Date: format(new Date(entry.date), 'MMM dd, yyyy'),
      Account: entry.account,
      Type: entry.type,
      Description: entry.description,
      Debit: entry.debit,
      Credit: entry.credit
    })))

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ledger')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob(
      [excelBuffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    )
    
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(data)
    link.download = 'ledger.xlsx'
    link.click()
  }

  return (
    (<div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Ledger</h1>
        <div
          className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
          <Button onClick={handleDownloadPDF} className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button onClick={handleDownloadExcel} className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" /> Excel
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                type="date"
                id="start-date"
                name="startDate"
                value={startDate}
                onChange={handleDateChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                type="date"
                id="end-date"
                name="endDate"
                value={endDate}
                onChange={handleDateChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account-type">Account Type</Label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger id="account-type">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 flex-grow">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search accounts or descriptions"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLedger.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{entry.account}</TableCell>
                  <TableCell>{entry.type}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell className="text-right">${entry.debit.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${entry.credit.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>)
  );
}

