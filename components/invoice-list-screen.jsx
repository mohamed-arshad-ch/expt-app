"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, MoreHorizontal, Printer } from 'lucide-react';
import { InvoiceModal } from './invoice-modal'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dummy data for invoices
const invoiceData = [
  { id: 1, invoiceNumber: 'INV-0001', customerName: 'John Doe', date: "2023-05-01", total: 1500, status: 'Paid' },
  { id: 2, invoiceNumber: 'INV-0002', customerName: 'Jane Smith', date: "2023-05-03", total: 2000, status: 'Unpaid' },
  { id: 3, invoiceNumber: 'INV-0003', customerName: 'Bob Johnson', date: "2023-05-05", total: 1000, status: 'Paid' },
  { id: 4, invoiceNumber: 'INV-0004', customerName: 'Alice Brown', date: "2023-05-10", total: 3000, status: 'Unpaid' },
  { id: 5, invoiceNumber: 'INV-0005', customerName: 'Charlie Davis', date: "2023-05-15", total: 1800, status: 'Paid' },
  { id: 6, invoiceNumber: 'INV-0006', customerName: 'Eva Wilson', date: "2023-05-20", total: 2200, status: 'Unpaid' },
  { id: 7, invoiceNumber: 'INV-0007', customerName: 'Frank Miller', date: "2023-05-25", total: 1300, status: 'Paid' },
  { id: 8, invoiceNumber: 'INV-0008', customerName: 'Grace Taylor', date: "2023-05-28", total: 2500, status: 'Unpaid' },
  { id: 9, invoiceNumber: 'INV-0009', customerName: 'Henry Clark', date: "2023-06-01", total: 1700, status: 'Paid' },
  { id: 10, invoiceNumber: 'INV-0010', customerName: 'Ivy Martin', date: "2023-06-05", total: 1900, status: 'Unpaid' },
]

const statuses = ["All", "Paid", "Unpaid"]

const generatePrintableInvoice = (invoice) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
        }
        .invoice-details {
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .total {
          font-weight: bold;
          font-size: 18px;
          text-align: right;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="invoice-title">INVOICE</div>
          <div>
            <div>Invoice Number: ${invoice.invoiceNumber}</div>
            <div>Date: ${format(new Date(invoice.date), 'MMMM dd, yyyy')}</div>
          </div>
        </div>
        <div class="invoice-details">
          <div><strong>Bill To:</strong></div>
          <div>${invoice.customerName}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${invoice.invoiceNumber}</td>
              <td>${invoice.customerName}</td>
              <td>${format(new Date(invoice.date), 'MMMM dd, yyyy')}</td>
              <td>$${invoice.total.toFixed(2)}</td>
              <td>${invoice.status}</td>
            </tr>
          </tbody>
        </table>
        <div class="total">Total: $${invoice.total.toFixed(2)}</div>
      </div>
    </body>
    </html>
  `;
}

export default function InvoiceListScreen() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [status, setStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 5

  const handleDateChange = (e) => {
    const { name, value } = e.target
    if (name === "startDate") setStartDate(value)
    if (name === "endDate") setEndDate(value)
  }

  const filteredInvoices = invoiceData.filter(invoice => {
    const invoiceDate = new Date(invoice.date)
    const matchesDateRange = 
      (!startDate || invoiceDate >= new Date(startDate)) &&
      (!endDate || invoiceDate <= new Date(endDate))
    const matchesStatus = status === "All" || invoice.status === status
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesDateRange && matchesStatus && matchesSearch
  })

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0)

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAddInvoice = () => {
    setSelectedInvoice(null)
    setIsModalOpen(true)
  }

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  const handleDeleteInvoice = (id) => {
    // Implement delete invoice logic
    console.log("Delete invoice with id:", id)
  }

  const handleSaveInvoice = (invoiceData) => {
    // Implement save logic here
    console.log('Save invoice:', invoiceData)
    // You would typically update the state or make an API call here
    setIsModalOpen(false)
  }

  const handleBulkReminder = () => {
    // Implement bulk reminder logic
    console.log("Sending reminders for unpaid invoices...")
  }

  const handlePrintInvoice = (invoice) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(generatePrintableInvoice(invoice))
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    } else {
      console.error('Unable to open print window')
    }
  }

  return (
    (<div className="space-y-6">
      <h1 className="text-3xl font-bold">Invoice List</h1>
      <Button onClick={handleAddInvoice} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Add Invoice
      </Button>
      {/* Summary Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  type="date"
                  id="start-date"
                  name="startDate"
                  value={startDate}
                  onChange={handleDateChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  type="date"
                  id="end-date"
                  name="endDate"
                  value={endDate}
                  onChange={handleDateChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(stat => (
                      <SelectItem key={stat} value={stat}>{stat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice Number</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className={invoice.status === 'Unpaid' ? 'bg-red-100' : ''}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{format(new Date(invoice.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>${invoice.total.toLocaleString()}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice.id)}>
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePrintInvoice(invoice)}>
                          <Printer className="mr-2 h-4 w-4" /> Print
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(filteredInvoices.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredInvoices.length, currentPage * itemsPerPage)} of {filteredInvoices.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Button onClick={handleBulkReminder}>Send Reminders for Unpaid Invoices</Button>
      <InvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvoice}
        initialData={selectedInvoice} />
    </div>)
  );
}

