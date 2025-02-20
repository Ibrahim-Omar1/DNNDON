import { NotificationTable } from '@/components/notifications/notification-table'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Notifications',
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
  }>
}

const Page = async ({ searchParams }: PageProps) => {
  // Await the searchParams before accessing properties
  const { page, limit } = await searchParams

  return (
    <>
      <NotificationTable
        initialPage={Number(page ?? 1)}
        initialLimit={Number(limit ?? 10)}
      />
    </>
  )
}

export default Page
