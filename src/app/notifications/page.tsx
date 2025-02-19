import { NotificationTable } from "@/components/notification-table"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notifications",
  description: "Notifications",
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
  }>
}

const Page = async ({ searchParams }: PageProps) => {
  // Await the searchParams before accessing properties
  const params = await searchParams

  // Convert and validate pagination params with nullish coalescing
  const page = Number(params?.page ?? "1")
  const limit = Number(params?.limit ?? "10")

  return (
    <div>
      <NotificationTable initialPage={page} initialLimit={limit} />
    </div>
  )
}

export default Page
