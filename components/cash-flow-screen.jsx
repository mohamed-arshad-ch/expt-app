"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import { Download } from 'lucide-react';
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

// Dummy data for cash flow
const cashFlowData = {
  monthly: [
    { period: '2023-01', inflows: 50000, outflows: 40000 },
    { period: '2023-02', inflows: 55000, outflows: 42000 },
    { period: '2023-03', inflows: 60000, outflows: 45000 },
    { period: '2023-04', inflows: 58000, outflows: 44000 },
    { period: '2023-05', inflows: 62000, outflows: 47000 },
    { period: '2023-06', inflows: 65000, outflows: 49000 },
  ],
  quarterly: [
    { period: 'Q1 2023', inflows: 165000, outflows: 127000 },
    { period: 'Q2 2023', inflows: 185000, outflows: 140000 },
  ],
}

const viewOptions = ['Monthly', 'Quarterly']

export default function CashFlowScreen() {
  const [selectedView, setSelectedView] = useState('Monthly')

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Cash Flow Statement', 14, 15)
    doc.text(`View: ${selectedView}`, 14, 25)
    doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 14, 35)

    const data = selectedView === 'Monthly' ? cashFlowData.monthly : cashFlowData.quarterly
    const tableData = data.map(item => [
      selectedView === 'Monthly' ? format(new Date(item.period), 'MMMM yyyy') : item.period,
      `$${item.inflows.toLocaleString()}`,
      `$${item.outflows.toLocaleString()}`,
      `$${(item.inflows - item.outflows).toLocaleString()}`
    ])

    doc.autoTable({
      head: [['Period', 'Inflows', 'Outflows', 'Net Cash Flow']],
      body: tableData,
      startY: 45,
    })

    doc.save('cash_flow.pdf')
  }

  const handleDownloadExcel = () => {
    const data = selectedView === 'Monthly' ? cashFlowData.monthly : cashFlowData.quarterly
    const ws = XLSX.utils.json_to_sheet([
      { A: 'Cash Flow Statement' },
      { A: `View: ${selectedView}` },
      { A: `Generated on ${format(new Date(), 'MMMM d, yyyy')}` },
      { A: 'Period', B: 'Inflows', C: 'Outflows', D: 'Net Cash Flow' },
      ...data.map(item => ({
        A: selectedView === 'Monthly' ? format(new Date(item.period), 'MMMM yyyy') : item.period,
        B: item.inflows,
        C: item.outflows,
        D: item.inflows - item.outflows
      }))
    ])

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Cash Flow')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob(
      [excelBuffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    )
    
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(excelData)
    link.download = 'cash_flow.xlsx'
    link.click()
  }

  const data = selectedView === 'Monthly' ? cashFlowData.monthly : cashFlowData.quarterly

  return (
    (<div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Cash Flow Statement</h1>
        <div
          className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              {viewOptions.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
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
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow {selectedView} View</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Inflows</TableHead>
                <TableHead className="text-right">Outflows</TableHead>
                <TableHead className="text-right">Net Cash Flow</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => {
                const netCashFlow = item.inflows - item.outflows
                return (
                  (<TableRow key={item.period}>
                    <TableCell>
                      {selectedView === 'Monthly'
                        ? format(new Date(item.period), 'MMMM yyyy')
                        : item.period}
                    </TableCell>
                    <TableCell className="text-right">${item.inflows.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.outflows.toLocaleString()}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(netCashFlow).toLocaleString()}
                    </TableCell>
                  </TableRow>)
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>)
  );
}

