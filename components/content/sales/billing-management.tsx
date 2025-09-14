"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Receipt, Calendar, Check, Clock, X } from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'year'
  tokens: number
  features: string[]
  popular?: boolean
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface BillingHistory {
  id: string
  date: Date
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
  invoiceUrl?: string
}

interface BillingManagementProps {
  currentPlanData?: SubscriptionPlan
  billingHistory: BillingHistory[]
  formatCurrency: (amount: number) => string
}

export function BillingManagement({ currentPlanData, billingHistory, formatCurrency }: BillingManagementProps) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <CardDescription>
              Manage your payment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6" />
                <div>
                  <div className="font-medium">•••• •••• •••• 4242</div>
                  <div className="text-sm text-muted-foreground">Expires 12/26</div>
                </div>
              </div>
              <Badge variant="secondary">Primary</Badge>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Update Card
              </Button>
              <Button variant="outline" className="flex-1">
                Add Card
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Next Billing
            </CardTitle>
            <CardDescription>
              Your upcoming subscription charges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{currentPlanData?.name} Plan</div>
                <div className="text-sm text-muted-foreground">
                  Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(currentPlanData?.price || 0)}</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(currentPlanData?.price || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatCurrency((currentPlanData?.price || 0) * 0.08)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency((currentPlanData?.price || 0) * 1.08)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {billingHistory.map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded ${
                      invoice.status === 'paid' ? 'bg-green-100' :
                      invoice.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {invoice.status === 'paid' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : invoice.status === 'pending' ? (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{invoice.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                      <Badge variant={
                        invoice.status === 'paid' ? 'default' :
                        invoice.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {invoice.status}
                      </Badge>
                    </div>
                    {invoice.invoiceUrl && (
                      <Button variant="outline" size="sm">
                        <Receipt className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}