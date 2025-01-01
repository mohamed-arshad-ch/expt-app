import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Plus, Minus, Printer, Mail } from 'lucide-react'

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function InvoiceModal({
  isOpen,
  onClose,
  onSave,
  initialData
}) {
  const [invoiceData, setInvoiceData] = useState(initialData || {
    invoiceNumber: '',
    customerName: '',
    customerAddress: '',
    customerContact: '',
    date: new Date(),
    items: [],
    status: 'Unpaid',
    notes: '',
  })

  useEffect(() => {
    if (initialData) {
      setInvoiceData({
        ...initialData,
        items: initialData.items || [],
      })
    } else {
      setInvoiceData(prev => ({
        ...prev,
        invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        items: [],
      }))
    }
  }, [initialData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setInvoiceData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date) => {
    if (date) {
      setInvoiceData(prev => ({ ...prev, date }))
    }
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = invoiceData.items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value }
      }
      return item
    })
    setInvoiceData(prev => ({ ...prev, items: updatedItems }))
  }

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...(prev.items || []), { name: '', quantity: 1, price: 0, tax: 0 }],
    }))
  }

  const removeItem = (index) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const calculateTotal = () => {
    return invoiceData.items.reduce((total, item) => {
      const itemTotal = item.quantity * item.price
      const taxAmount = (itemTotal * item.tax) / 100
      return total + itemTotal + taxAmount
    }, 0);
  }

  const handleSave = () => {
    onSave({ ...invoiceData, total: calculateTotal() })
    onClose()
  }

  const generatePrintableInvoice = () => {
    const total = calculateTotal()
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceData.invoiceNumber}</title>
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
              <div>Invoice Number: ${invoiceData.invoiceNumber}</div>
              <div>Date: ${format(invoiceData.date, 'MMMM dd, yyyy')}</div>
            </div>
          </div>
          <div class="invoice-details">
            <div><strong>Bill To:</strong></div>
            <div>${invoiceData.customerName}</div>
            <div>${invoiceData.customerAddress}</div>
            <div>${invoiceData.customerContact}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Tax (%)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>${item.tax}%</td>
                  <td>$${((item.quantity * item.price) + (item.quantity * item.price * item.tax / 100)).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total: $${total.toFixed(2)}</div>
          <div>
            <strong>Notes:</strong>
            <p>${invoiceData.notes}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(generatePrintableInvoice())
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    } else {
      console.error('Unable to open print window')
    }
  }

  const handleEmail = () => {
    console.log('Emailing invoice...')
  }

  return (
    (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle>{initialData ? 'Edit Invoice' : 'Add Invoice'}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={invoiceData.invoiceNumber}
                  onChange={handleInputChange}
                  disabled />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal`}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {invoiceData.date ? format(invoiceData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={invoiceData.date}
                      onSelect={handleDateSelect}
                      initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                name="customerName"
                value={invoiceData.customerName}
                onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerAddress">Customer Address</Label>
              <Textarea
                id="customerAddress"
                name="customerAddress"
                value={invoiceData.customerAddress}
                onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerContact">Customer Contact</Label>
              <Input
                id="customerContact"
                name="customerContact"
                value={invoiceData.customerContact}
                onChange={handleInputChange} />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              <Label>Items</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Tax (%)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(invoiceData.items || []).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))} />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.tax}
                          onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value))} />
                      </TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => removeItem(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
            <div className="space-y-2">
              <Label htmlFor="status">Payment Status</Label>
              <Select
                value={invoiceData.status}
                onValueChange={(value) => setInvoiceData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={invoiceData.notes}
                onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <div className="text-2xl font-bold">${calculateTotal().toFixed(2)}</div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between mt-4">
          <div>
            <Button variant="outline" onClick={handlePrint} className="mr-2">
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" onClick={handleEmail}>
              <Mail className="mr-2 h-4 w-4" /> Email
            </Button>
          </div>
          <Button type="submit" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>)
  );
}

