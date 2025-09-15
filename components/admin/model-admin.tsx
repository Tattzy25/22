"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelCard } from "@/components/models/model-card";
import { Save } from "lucide-react";

interface ModelFormData {
  id?: string;
  name: string;
  provider: string;
  capability1: string;
  capability2: string;
  capability3: string;
  capability4: string;
  tooltip: string;
  status: 'available' | 'unavailable' | 'idle';
  publish: boolean;
}

interface ModelAdminProps {
  onFormChange?: (formData: ModelFormData) => void
}

export default function ModelAdmin({ onFormChange }: ModelAdminProps) {
  const [formData, setFormData] = useState<ModelFormData>({
    name: "",
    provider: "",
    capability1: "",
    capability2: "",
    capability3: "",
    capability4: "",
    tooltip: "",
    status: 'available',
    publish: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (field: keyof ModelFormData, value: string | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      onFormChange?.(newData)
      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const payload = {
        id: formData.id, // For updates
        name: formData.name,
        provider: formData.provider,
        capability1: formData.capability1,
        capability2: formData.capability2,
        capability3: formData.capability3,
        capability4: formData.capability4,
        tooltip: formData.tooltip,
        status: formData.status,
        publish: formData.publish
      };

      const response = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save model');
      }

      setMessage("Model saved successfully!");
    } catch (error) {
      console.error('Error saving model:', error);
      setMessage("Error saving model. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const capabilities = [formData.capability1, formData.capability2, formData.capability3, formData.capability4].filter(Boolean);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">New / Edit Model</CardTitle>
            <CardDescription>
              Configure the model details. Changes will be reflected in the preview on the right.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Model Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., GPT-4"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Provider *</Label>
                  <Input
                    id="provider"
                    value={formData.provider}
                    onChange={(e) => handleInputChange('provider', e.target.value)}
                    placeholder="e.g., OpenAI"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 !mt-px">
                <Label>Capabilities</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={formData.capability1}
                    onChange={(e) => handleInputChange('capability1', e.target.value)}
                    placeholder="Capability 1"
                  />
                  <Input
                    value={formData.capability2}
                    onChange={(e) => handleInputChange('capability2', e.target.value)}
                    placeholder="Capability 2"
                  />
                  <Input
                    value={formData.capability3}
                    onChange={(e) => handleInputChange('capability3', e.target.value)}
                    placeholder="Capability 3"
                  />
                  <Input
                    value={formData.capability4}
                    onChange={(e) => handleInputChange('capability4', e.target.value)}
                    placeholder="Capability 4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tooltip">Tooltip / More Description</Label>
                <Textarea
                  id="tooltip"
                  value={formData.tooltip}
                  onChange={(e) => handleInputChange('tooltip', e.target.value)}
                  placeholder="Additional information about the model..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'available' | 'unavailable' | 'idle') => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                    <SelectItem value="idle">Idle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="publish"
                  checked={formData.publish}
                  onCheckedChange={(checked) => handleInputChange('publish', checked)}
                />
                <Label htmlFor="publish">Publish (show on All Models page)</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>

              {message && (
                <div className={`p-3 rounded-md ${message.includes('Error') ? 'bg-destructive/10 text-destructive' : 'bg-green-50 text-green-700'}`}>
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Right Pane: Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              This is how the model card will appear to users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ModelCard
                name={formData.name || "Model Name"}
                provider={formData.provider || "Provider"}
                capabilities={capabilities.length > 0 ? capabilities : ["Capability 1", "Capability 2", "Capability 3", "Capability 4"]}
                status={formData.status}
                onTry={() => {}}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}