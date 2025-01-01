"use client";
import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const categories = ["Salary", "Freelance", "Investment", "Other"]
const paymentMethods = ["Cash", "Card", "Bank Transfer"]

export function IncomeModal({
  isOpen,
  onClose,
  onSave,
  initialData
}) {
  const [incomeData, setIncomeData] = useState(initialData || {
    date: new Date(),
    amount: '',
    category: '',
    paymentMethod: '',
    notes: '',
    receipt: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setIncomeData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date) => {
    if (date) {
      setIncomeData(prev => ({ ...prev, date }))
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIncomeData(prev => ({ ...prev, receipt: e.target.files[0] }))
    }
  }

  const handleSave = () => {
    onSave(incomeData)
    onClose()
  }

  return (
    (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Income' : 'Add Income'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[280px] justify-start text-left font-normal col-span-3`}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {incomeData.date ? format(incomeData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={incomeData.date}
                  onSelect={handleDateSelect}
                  initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={incomeData.amount}
              onChange={handleInputChange}
              className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={incomeData.category}
              onValueChange={(value) => setIncomeData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentMethod" className="text-right">
              Payment Method
            </Label>
            <Select
              value={incomeData.paymentMethod}
              onValueChange={(value) => setIncomeData(prev => ({ ...prev, paymentMethod: value }))}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={incomeData.notes}
              onChange={handleInputChange}
              className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="receipt" className="text-right">
              Receipt
            </Label>
            <Input
              id="receipt"
              type="file"
              onChange={handleFileChange}
              className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>)
  );
}

