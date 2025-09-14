"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield } from "lucide-react"
import { useApi } from "./api/use-api"
import { AddKeyDialog } from "./api/add-key-dialog"
import { ApiKeys } from "./api/api-keys"
import { UsageLimits } from "./api/usage-limits"
import { BillingManagement } from "./api/billing-management"
import { SecuritySettings } from "./api/security-settings"

export function ApiContent() {
  const [activeTab, setActiveTab] = useState('keys')
  const {
    apiKeys,
    billingInfo,
    visibleKeys,
    addApiKey,
    toggleKeyVisibility,
    toggleKeyStatus,
    deleteKey,
    copyToClipboard,
    getUsagePercentage
  } = useApi()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API Management</h2>
          <p className="text-muted-foreground">
            Manage API keys, monitor usage, and control billing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {apiKeys.filter(k => k.isActive).length} Active Keys
          </Badge>
          <AddKeyDialog onAddKey={addApiKey} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6 mt-6">
          <ApiKeys
            apiKeys={apiKeys}
            visibleKeys={visibleKeys}
            onToggleVisibility={toggleKeyVisibility}
            onToggleStatus={toggleKeyStatus}
            onDeleteKey={deleteKey}
            onCopyToClipboard={copyToClipboard}
          />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 mt-6">
          <UsageLimits
            billingInfo={billingInfo}
            getUsagePercentage={getUsagePercentage}
          />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <BillingManagement billingInfo={billingInfo} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <SecuritySettings apiKeys={apiKeys} />
        </TabsContent>
      </Tabs>
    </div>
  )
}