"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Gift, Zap, Crown, Rocket, Star } from "lucide-react"

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

interface SubscriptionPlansProps {
  subscriptionPlans: SubscriptionPlan[]
  currentPlan: string
  setSelectedPlan: (planId: string) => void
  setShowUpgradeDialog: (show: boolean) => void
  formatCurrency: (amount: number) => string
}

const PlanCard = ({
  plan,
  currentPlan,
  setSelectedPlan,
  setShowUpgradeDialog,
  formatCurrency
}: {
  plan: SubscriptionPlan
  currentPlan: string
  setSelectedPlan: (planId: string) => void
  setShowUpgradeDialog: (show: boolean) => void
  formatCurrency: (amount: number) => string
}) => {
  const Icon = plan.icon
  const isCurrentPlan = plan.id === currentPlan

  return (
    <Card className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
        </div>
      )}

      <CardHeader className="text-center">
        <div className={`mx-auto mb-2 ${plan.color}`}>
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
          <span className="text-muted-foreground">/{plan.interval}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            {plan.tokens.toLocaleString()} AI tokens per month
          </div>

          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="pt-4">
            {isCurrentPlan ? (
              <Button className="w-full" disabled>
                <Check className="h-4 w-4 mr-2" />
                Current Plan
              </Button>
            ) : (
              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedPlan(plan.id)
                  setShowUpgradeDialog(true)
                }}
              >
                {plan.price === 0 ? 'Get Started' : 'Upgrade'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SubscriptionPlans({
  subscriptionPlans,
  currentPlan,
  setSelectedPlan,
  setShowUpgradeDialog,
  formatCurrency
}: SubscriptionPlansProps) {
  return (
    <>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Choose Your Plan</h3>
        <p className="text-muted-foreground">
          Select the perfect plan for your AI creation needs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {subscriptionPlans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlan={currentPlan}
            setSelectedPlan={setSelectedPlan}
            setShowUpgradeDialog={setShowUpgradeDialog}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>

      <Alert>
        <Gift className="h-4 w-4" />
        <AlertDescription>
          <strong>Special Offer:</strong> Get 20% off your first year with annual billing.
          All plans include a 14-day free trial.
        </AlertDescription>
      </Alert>
    </>
  )
}