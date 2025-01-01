"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, MoreHorizontal } from 'lucide-react';
import { X } from 'lucide-react'

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
import { IncomeModal } from './income-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dummy data
const incomeData = [
  { id: 1, date: "2023-05-01", category: "Salary", amount: 5000, paymentMethod: "Bank Transfer", notes: "Monthly salary" },
  { id: 2, date: "2023-05-05", category: "Freelance", amount: 1000, paymentMethod: "PayPal", notes: "Web design project" },
  { id: 3, date: "2023-05-10", category: "Investment", amount: 500, paymentMethod: "Bank Transfer", notes: "Dividend payment" },
  { id: 4, date: "2023-05-15", category: "Salary", amount: 5000, paymentMethod: "Bank Transfer", notes: "Monthly salary" },
  { id: 5, date: "2023-05-20", category: "Freelance", amount: 1500, paymentMethod: "PayPal", notes: "Mobile app development" },
  { id: 6, date: "2023-05-25", category: "Investment", amount: 750, paymentMethod: "Bank Transfer", notes: "Stock sale" },
  { id: 7, date: "2023-05-28", category: "Salary", amount: 5000, paymentMethod: "Bank Transfer", notes: "Monthly salary" },
  { id: 8, date: "2023-06-01", category: "Freelance", amount: 2000, paymentMethod: "PayPal", notes: "Consulting work" },
  { id: 9, date: "2023-06-05", category: "Investment", amount: 1000, paymentMethod: "Bank Transfer", notes: "Rental income" },
  { id: 10, date: "2023-06-10", category: "Salary", amount: 5000, paymentMethod: "Bank Transfer", notes: "Monthly salary" },
  { id: 11, date: "2023-06-15", category: "Freelance", amount: 1800, paymentMethod: "PayPal", notes: "UI/UX design project" },
  { id: 12, date: "2023-06-20", category: "Investment", amount: 600, paymentMethod: "Bank Transfer", notes: "Dividend payment" },
]

const categories = ["All", "Salary", "Freelance", "Investment"]
const paymentMethods = ["All", "Bank Transfer", "PayPal", "Cash"]

export default function IncomeListScreen() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [category, setCategory] = useState("All")
  const [paymentMethod, setPaymentMethod] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIncome, setSelectedIncome] = useState(null)
  const [viewPanelOpen, setViewPanelOpen] = useState(false)

  const handleDateChange = (e) => {
    const { name, value } = e.target
    if (name === "startDate") setStartDate(value)
    if (name === "endDate") setEndDate(value)
  }

  const filteredIncome = incomeData.filter(income => {
    const incomeDate = new Date(income.date)
    const matchesDateRange = 
      (!startDate || incomeDate >= new Date(startDate)) &&
      (!endDate || incomeDate <= new Date(endDate))
    const matchesCategory = category === "All" || income.category === category
    const matchesPaymentMethod = paymentMethod === "All" || income.paymentMethod === paymentMethod
    const matchesSearch = income.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesDateRange && matchesCategory && matchesPaymentMethod && matchesSearch
  })

  const totalIncome = filteredIncome.reduce((sum, income) => sum + income.amount, 0)

  const totalPages = Math.ceil(filteredIncome.length / itemsPerPage)
  const paginatedIncome = filteredIncome.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAddIncome = () => {
    setSelectedIncome(null)
    setIsModalOpen(true)
  }

  const handleEditIncome = (income) => {
    setSelectedIncome(income)
    setIsModalOpen(true)
  }

  const handleDeleteIncome = (id) => {
    // Implement delete logic here
    console.log(`Delete income with id: ${id}`)
  }

  const handleViewIncome = (income) => {
    setSelectedIncome(income)
    setViewPanelOpen(true)
  }

  const handleSaveIncome = (incomeData) => {
    // Implement save logic here
    console.log('Save income:', incomeData)
  }

  return (
    (<div className="space-y-6">
      <h1 className="text-3xl font-bold">Income List</h1>
      <Button onClick={handleAddIncome} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Add Income
      </Button>
      {/* Summary Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
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
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Income Table */}
      <Card>
        <CardHeader>
          <CardTitle>Income Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">S.No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedIncome.map((income, index) => (
                <TableRow key={income.id}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{format(new Date(income.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{income.category}</TableCell>
                  <TableCell>${income.amount.toLocaleString()}</TableCell>
                  <TableCell>{income.paymentMethod}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditIncome(income)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteIncome(income.id)}>
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewIncome(income)}>
                          View Details
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
            Showing {Math.min(filteredIncome.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredIncome.length, currentPage * itemsPerPage)} of {filteredIncome.length} entries
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
      <IncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIncome}
        initialData={selectedIncome} />
      {viewPanelOpen && selectedIncome && (
        <div
          className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewPanelOpen(false)}
            className="absolute top-4 right-4">
            <X className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold mb-4">Income Details</h2>
          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <p>{format(new Date(selectedIncome.date), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <Label>Category</Label>
              <p>{selectedIncome.category}</p>
            </div>
            <div>
              <Label>Amount</Label>
              <p>${selectedIncome.amount.toLocaleString()}</p>
            </div>
            <div>
              <Label>Payment Method</Label>
              <p>{selectedIncome.paymentMethod}</p>
            </div>
            <div>
              <Label>Notes</Label>
              <p>{selectedIncome.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>)
  );
}

