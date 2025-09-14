"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { CreditCard, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { BillingInfo, billingPlans } from "./types"

interface BillingManagementProps {
  billingInfo: BillingInfo
}

export function BillingManagement({ billingInfo }: BillingManagementProps) {
  const currentPlan = billingPlans.find(p => p.id === billingInfo.plan)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {currentPlan?.name}
              </h3>
              <p className="text-muted-foreground">
                ${currentPlan?.price}/month
              </p>
            </div>
            <Badge variant={billingInfo.status === 'active' ? 'default' : 'destructive'}>
              {billingInfo.status}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Monthly Requests</span>
              <span>{billingInfo.limits.monthlyRequests.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Tokens</span>
              <span>{billingInfo.limits.monthlyTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Budget</span>
              <span>${billingInfo.limits.monthlyBudget}</span>
            </div>
          </div>

          <Button className="w-full">
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Billing Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>•••• •••• •••• {billingInfo.paymentMethod.last4}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Next Billing Date</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{billingInfo.nextBillingDate.toLocaleDateString()}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Current Month Cost</span>
              <span>${billingInfo.currentUsage.cost}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Estimated Total</span>
              <span>${currentPlan?.price}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Update Payment
            </Button>
            <Button variant="outline" className="flex-1">
              View Invoices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}