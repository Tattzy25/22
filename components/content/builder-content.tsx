"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function BuilderContent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Automation Builder</CardTitle>
          <CardDescription>
            Create powerful AI workflows with drag & drop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Canva-style automation builder coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}