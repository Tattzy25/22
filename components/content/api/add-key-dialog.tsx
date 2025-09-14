"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { aiProviders } from "./types"

interface AddKeyDialogProps {
  onAddKey: (key: {
    provider: string
    name: string
    key: string
    monthlyRequests: number
    monthlyTokens: number
    monthlyBudget: number
  }) => void
}

export function AddKeyDialog({ onAddKey }: AddKeyDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newKey, setNewKey] = useState({
    provider: '',
    name: '',
    key: '',
    monthlyRequests: 1000,
    monthlyTokens: 10000,
    monthlyBudget: 5
  })

  const handleAddKey = () => {
    if (!newKey.provider || !newKey.name || !newKey.key) return

    onAddKey(newKey)
    setNewKey({
      provider: '',
      name: '',
      key: '',
      monthlyRequests: 1000,
      monthlyTokens: 10000,
      monthlyBudget: 5
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add API Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New API Key</DialogTitle>
          <DialogDescription>
            Add an API key for a new AI provider
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={newKey.provider}
              onValueChange={(value) => setNewKey(prev => ({ ...prev, provider: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {aiProviders.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center gap-2">
                      <span>{provider.icon}</span>
                      {provider.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="key-name">Key Name</Label>
            <Input
              id="key-name"
              value={newKey.name}
              onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., OpenAI Production"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={newKey.key}
              onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
              placeholder="Enter your API key"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-requests">Monthly Requests</Label>
              <Input
                id="monthly-requests"
                type="number"
                value={newKey.monthlyRequests}
                onChange={(e) => setNewKey(prev => ({ ...prev, monthlyRequests: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-tokens">Monthly Tokens</Label>
              <Input
                id="monthly-tokens"
                type="number"
                value={newKey.monthlyTokens}
                onChange={(e) => setNewKey(prev => ({ ...prev, monthlyTokens: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-budget">Monthly Budget ($)</Label>
              <Input
                id="monthly-budget"
                type="number"
                step="0.01"
                value={newKey.monthlyBudget}
                onChange={(e) => setNewKey(prev => ({ ...prev, monthlyBudget: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleAddKey}
              disabled={!newKey.provider || !newKey.name || !newKey.key}
            >
              Add Key
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}