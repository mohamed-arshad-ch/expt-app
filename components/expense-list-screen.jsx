import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, MoreHorizontal, X } from 'lucide-react';
import { ExpenseModal } from './expense-modal'

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dummy data for expenses
const expenseData = [
  { id: 1, date: "2023-05-01", category: "Groceries", amount: 150, paymentMethod: "Credit Card" },
  { id: 2, date: "2023-05-03", category: "Utilities", amount: 200, paymentMethod: "Bank Transfer" },
  { id: 3, date: "2023-05-05", category: "Entertainment", amount: 50, paymentMethod: "Cash" },
  { id: 4, date: "2023-05-10", category: "Rent", amount: 1000, paymentMethod: "Bank Transfer" },
  { id: 5, date: "2023-05-15", category: "Groceries", amount: 100, paymentMethod: "Credit Card" },
  { id: 6, date: "2023-05-20", category: "Transportation", amount: 30, paymentMethod: "Cash" },
  { id: 7, date: "2023-05-25", category: "Utilities", amount: 150, paymentMethod: "Bank Transfer" },
  { id: 8, date: "2023-05-28", category: "Entertainment", amount: 80, paymentMethod: "Credit Card" },
  { id: 9, date: "2023-06-01", category: "Groceries", amount: 120, paymentMethod: "Credit Card" },
  { id: 10, date: "2023-06-05", category: "Transportation", amount: 25, paymentMethod: "Cash" },
]

const categories = ["All", "Groceries", "Utilities", "Entertainment", "Rent", "Transportation"]
const paymentMethods = ["All", "Credit Card", "Bank Transfer", "Cash"]

export default function ExpenseListScreen() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [category, setCategory] = useState("All")
  const [paymentMethod, setPaymentMethod] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [viewPanelOpen, setViewPanelOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 5

  const handleDateChange = (e) => {
    const { name, value } = e.target
    if (name === "startDate") setStartDate(value)
    if (name === "endDate") setEndDate(value)
  }

  const filteredExpenses = expenseData.filter(expense => {
    const expenseDate = new Date(expense.date)
    const matchesDateRange = 
      (!startDate || expenseDate >= new Date(startDate)) &&
      (!endDate || expenseDate <= new Date(endDate))
    const matchesCategory = category === "All" || expense.category === category
    const matchesPaymentMethod = paymentMethod === "All" || expense.paymentMethod === paymentMethod
    const matchesSearch = expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesDateRange && matchesCategory && matchesPaymentMethod && matchesSearch
  })

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAddExpense = () => {
    setSelectedExpense(null)
    setIsModalOpen(true)
  }

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense)
    setIsModalOpen(true)
  }

  const handleDeleteExpense = (id) => {
    // Implement delete expense logic
    console.log("Delete expense with id:", id)
  }

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense)
    setViewPanelOpen(true)
  }

  const handleSaveExpense = (expenseData) => {
    // Implement save logic here
    console.log('Save expense:', expenseData)
    // You would typically update the state or make an API call here
    setIsModalOpen(false)
  }

  return (
    (<div className="space-y-6">
      <h1 className="text-3xl font-bold">Expense List</h1>
      <Button onClick={handleAddExpense} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Add Expense
      </Button>
      {/* Summary Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
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
      {/* Expense Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Entries</CardTitle>
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
              {paginatedExpenses.map((expense, index) => (
                <TableRow key={expense.id}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{format(new Date(expense.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>${expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{expense.paymentMethod}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditExpense(expense)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteExpense(expense.id)}>
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewExpense(expense)}>
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
            Showing {Math.min(filteredExpenses.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredExpenses.length, currentPage * itemsPerPage)} of {filteredExpenses.length} entries
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
      {viewPanelOpen && selectedExpense && (
        <div
          className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewPanelOpen(false)}
            className="absolute top-4 right-4">
            <X className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold mb-4">Expense Details</h2>
          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <p>{format(new Date(selectedExpense.date), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <Label>Category</Label>
              <p>{selectedExpense.category}</p>
            </div>
            <div>
              <Label>Amount</Label>
              <p>${selectedExpense.amount.toLocaleString()}</p>
            </div>
            <div>
              <Label>Payment Method</Label>
              <p>{selectedExpense.paymentMethod}</p>
            </div>
          </div>
        </div>
      )}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpense}
        initialData={selectedExpense} />
    </div>)
  );
}

