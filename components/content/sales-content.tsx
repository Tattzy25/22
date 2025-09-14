"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { SubscriptionPlans } from "./sales/subscription-plans"
import { UsageAnalytics } from "./sales/usage-analytics"
import { BillingManagement } from "./sales/billing-management"
import { SubscriptionSettings } from "./sales/subscription-settings"
import { useSalesState } from "./sales/use-sales"

export function SalesContent() {
  const {
    currentPlan,
    selectedPlan,
    showUpgradeDialog,
    subscriptionPlans,
    usageStats,
    billingHistory,
    currentPlanData,
    selectedPlanData,
    setSelectedPlan,
    setShowUpgradeDialog,
    getUsagePercentage,
    formatCurrency,
    upgradePlan
  } = useSalesState()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscription & Billing</h2>
          <p className="text-muted-foreground">
            Manage your subscription, view usage, and handle billing
          </p>
        </div>
      </div>

      <Tabs defaultValue="plans" className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6 mt-6">
          <SubscriptionPlans
            subscriptionPlans={subscriptionPlans}
            currentPlan={currentPlan}
            setSelectedPlan={setSelectedPlan}
            setShowUpgradeDialog={setShowUpgradeDialog}
            formatCurrency={formatCurrency}
          />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 mt-6">
          <UsageAnalytics
            usageStats={usageStats}
            getUsagePercentage={getUsagePercentage}
          />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <BillingManagement
            currentPlanData={currentPlanData}
            billingHistory={billingHistory}
            formatCurrency={formatCurrency}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <SubscriptionSettings />
        </TabsContent>
      </Tabs>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              {selectedPlanData && (
                <>Upgrade to the {selectedPlanData.name} plan for {formatCurrency(selectedPlanData.price)}/{selectedPlanData.interval}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPlanData && (
              <div className="p-4 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{selectedPlanData.name} Plan</h4>
                  <span className="text-lg font-bold">{formatCurrency(selectedPlanData.price)}/{selectedPlanData.interval}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedPlanData.tokens.toLocaleString()} AI tokens per month
                </p>
                <ul className="space-y-1">
                  {selectedPlanData.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-3 w-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={upgradePlan} className="flex-1">
                Confirm Upgrade
              </Button>
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}