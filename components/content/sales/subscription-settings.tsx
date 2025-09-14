"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Settings, Gift, Users, Shield } from "lucide-react"

export function SubscriptionSettings() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Subscription Settings
          </CardTitle>
          <CardDescription>
            Manage your subscription preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Billing Cycle</Label>
            <Select defaultValue="monthly">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly (Save 20%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Usage Alerts</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Email when 80% of tokens used</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Email when 90% of tokens used</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span className="text-sm">Email billing receipts</span>
              </label>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Download Data
            </Button>
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Referral Program
          </CardTitle>
          <CardDescription>
            Earn free months by referring friends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">2</div>
            <div className="text-sm text-muted-foreground">Friends referred</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">$38</div>
            <div className="text-sm text-muted-foreground">Credits earned</div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Referral Link</Label>
            <div className="flex gap-2">
              <Input value="https://bridgit.ai/ref/john-doe-123" readOnly />
              <Button variant="outline">
                Copy
              </Button>
            </div>
          </div>

          <Button className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Invite Friends
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}