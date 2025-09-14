"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save } from "lucide-react";
import { turso } from "@/lib/turso";

interface ModelFormData {
  name: string;
  provider: string;
  category: string;
  capabilities: string[];
  description: string;
  contextWindow: string;
  responseTime: string;
  inputTokens: string;
  outputTokens: string;
}

interface ModelAdminProps {
  onFormChange?: (formData: ModelFormData) => void
}

export default function ModelAdmin({ onFormChange }: ModelAdminProps) {
  const [formData, setFormData] = useState<ModelFormData>({
    name: "",
    provider: "",
    category: "",
    capabilities: [],
    description: "",
    contextWindow: "",
    responseTime: "",
    inputTokens: "",
    outputTokens: "",
  });
  const [newCapability, setNewCapability] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (field: keyof ModelFormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      onFormChange?.(newData)
      return newData
    })
  }

  const addCapability = () => {
    if (newCapability.trim() && !formData.capabilities.includes(newCapability.trim())) {
      setFormData(prev => {
        const newData = {
          ...prev,
          capabilities: [...prev.capabilities, newCapability.trim()]
        }
        onFormChange?.(newData)
        return newData
      })
      setNewCapability("")
    }
  }

  const removeCapability = (capability: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        capabilities: prev.capabilities.filter(c => c !== capability)
      }
      onFormChange?.(newData)
      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // First, check if model exists, if not create it
      const existingModelResult = await turso.execute({
        sql: "SELECT id FROM models WHERE name = ?",
        args: [formData.name],
      });

      let modelId: string;

      if (existingModelResult.rows.length === 0) {
        // Create new model
        const newModelResult = await turso.execute({
          sql: `INSERT INTO models (name, category, capabilities, description, context_window, response_time)
                VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
          args: [
            formData.name,
            formData.category,
            JSON.stringify(formData.capabilities),
            formData.description,
            formData.contextWindow,
            formData.responseTime,
          ],
        });

        if (newModelResult.rows.length === 0) {
          throw new Error("Failed to create model");
        }
        modelId = newModelResult.rows[0].id as string;
      } else {
        // Update existing model
        modelId = existingModelResult.rows[0].id as string;
        await turso.execute({
          sql: `UPDATE models SET category = ?, capabilities = ?, description = ?, context_window = ?, response_time = ?
                WHERE id = ?`,
          args: [
            formData.category,
            JSON.stringify(formData.capabilities),
            formData.description,
            formData.contextWindow,
            formData.responseTime,
            modelId,
          ],
        });
      }

      // Create or update model-provider relationship
      await turso.execute({
        sql: `INSERT OR REPLACE INTO model_providers (model_id, provider, pricing, priority, is_active)
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          modelId,
          formData.provider,
          JSON.stringify({
            inputTokens: formData.inputTokens,
            outputTokens: formData.outputTokens,
          }),
          1, // Default priority
          true, // is_active
        ],
      });

      setMessage("Model saved successfully!");
      // Reset form
      setFormData({
        name: "",
        provider: "",
        category: "",
        capabilities: [],
        description: "",
        contextWindow: "",
        responseTime: "",
        inputTokens: "",
        outputTokens: "",
      });
    } catch (error) {
      console.error('Error saving model:', error);
      setMessage("Error saving model. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">AI Model Admin Panel</CardTitle>
          <CardDescription>
            Add or update AI models and their provider configurations. This will create the model cards displayed to users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Model Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., GPT-4, Claude 3 Opus"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Input
                  id="provider"
                  value={formData.provider}
                  onChange={(e) => handleInputChange('provider', e.target.value)}
                  placeholder="e.g., OpenAI, Anthropic, AI Gateway"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., General/Reasoning, Coding/Code-Assist, Embedding"
              />
            </div>

            <div className="space-y-2">
              <Label>Capabilities</Label>
              <div className="flex gap-2">
                <Input
                  value={newCapability}
                  onChange={(e) => setNewCapability(e.target.value)}
                  placeholder="Add a capability..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
                />
                <Button type="button" onClick={addCapability} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.capabilities.map((capability, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {capability}
                    <button
                      type="button"
                      onClick={() => removeCapability(capability)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      aria-label={`Remove ${capability} capability`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this model does..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contextWindow">Context Window</Label>
                <Input
                  id="contextWindow"
                  value={formData.contextWindow}
                  onChange={(e) => handleInputChange('contextWindow', e.target.value)}
                  placeholder="e.g., 128K tokens, 2M tokens"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responseTime">Response Time</Label>
                <Input
                  id="responseTime"
                  value={formData.responseTime}
                  onChange={(e) => handleInputChange('responseTime', e.target.value)}
                  placeholder="e.g., < 30 seconds, Fast, Very Fast"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inputTokens">Input Token Pricing</Label>
                <Input
                  id="inputTokens"
                  value={formData.inputTokens}
                  onChange={(e) => handleInputChange('inputTokens', e.target.value)}
                  placeholder="e.g., $0.03/1K tokens"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outputTokens">Output Token Pricing</Label>
                <Input
                  id="outputTokens"
                  value={formData.outputTokens}
                  onChange={(e) => handleInputChange('outputTokens', e.target.value)}
                  placeholder="e.g., $0.06/1K tokens"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Model"}
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
    </div>
  );
}