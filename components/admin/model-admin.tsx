"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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

  const supabase = createClientComponentClient();

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
      let { data: existingModel, error: modelCheckError } = await supabase
        .from('models')
        .select('id')
        .eq('name', formData.name)
        .single();

      if (modelCheckError && modelCheckError.code !== 'PGRST116') {
        throw modelCheckError;
      }

      let modelId: string;

      if (!existingModel) {
        // Create new model
        const { data: newModel, error: modelError } = await supabase
          .from('models')
          .insert({
            name: formData.name,
            category: formData.category,
            capabilities: formData.capabilities,
            description: formData.description,
            context_window: formData.contextWindow,
            response_time: formData.responseTime,
          })
          .select('id')
          .single();

        if (modelError) throw modelError;
        modelId = newModel.id;
      } else {
        // Update existing model
        const { error: updateError } = await supabase
          .from('models')
          .update({
            category: formData.category,
            capabilities: formData.capabilities,
            description: formData.description,
            context_window: formData.contextWindow,
            response_time: formData.responseTime,
          })
          .eq('id', existingModel.id);

        if (updateError) throw updateError;
        modelId = existingModel.id;
      }

      // Create or update model-provider relationship
      const { error: providerError } = await supabase
        .from('model_providers')
        .upsert({
          model_id: modelId,
          provider: formData.provider,
          pricing: {
            inputTokens: formData.inputTokens,
            outputTokens: formData.outputTokens,
          },
          priority: 1, // Default priority
          is_active: true,
        }, {
          onConflict: 'model_id,provider'
        });

      if (providerError) throw providerError;

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