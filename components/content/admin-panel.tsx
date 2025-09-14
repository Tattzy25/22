"use client"

export function AdminPanel() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
          <p className="text-muted-foreground">
            Customize and manage your application settings
          </p>
        </div>
      </div>
    </div>
  )
}