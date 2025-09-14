import { PageBuilder } from "@/components/admin/page-builder"

export default function PageBuilderPage() {
  return (
    <div className="h-screen">
      <PageBuilder pageId="main-page" isAdminMode={true} />
    </div>
  )
}