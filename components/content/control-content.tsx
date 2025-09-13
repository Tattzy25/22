"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ControlContent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Control Panel</CardTitle>
          <CardDescription>
            System administration and analytics dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Control panel and analytics coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}