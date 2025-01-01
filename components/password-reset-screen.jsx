"use client"

import { useState } from "react"
import { Eye, EyeOff } from 'lucide-react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function PasswordResetScreen() {
  const [step, setStep] = useState(1)
  const [resetMethod, setResetMethod] = useState('email')
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSendOTP = () => {
    if (resetMethod === 'email' && !email) {
      setError("Please enter your email address.")
      return
    }
    if (resetMethod === 'phone' && !phone) {
      setError("Please enter your phone number.")
      return
    }
    // TODO: Implement OTP sending logic here
    console.log(`Sending OTP to ${resetMethod === 'email' ? email : phone}`)
    setError("")
    setStep(2)
  }

  const handleResetPassword = () => {
    if (!otp) {
      setError("Please enter the OTP.")
      return
    }
    if (!newPassword) {
      setError("Please enter a new password.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    // TODO: Implement password reset logic here
    console.log("Resetting password with:", { otp, newPassword })
    setError("")
    // You would typically redirect to login page or show a success message here
  }

  return (
    (<div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Reset Method</Label>
                <RadioGroup defaultValue="email" onValueChange={(value) => setResetMethod(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone" />
                    <Label htmlFor="phone">Phone</Label>
                  </div>
                </RadioGroup>
              </div>
              {resetMethod === 'email' ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <PhoneInput
                    country={'us'}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      className: 'w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                    }}
                    containerClass="w-full" />
                </div>
              )}
              <Button onClick={handleSendOTP} className="w-full">
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter the OTP sent to you"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required />
              </div>
              <Button onClick={handleResetPassword} className="w-full">
                Reset Password
              </Button>
            </div>
          )}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>
    </div>)
  );
}

