// import { NotificationTableSuspense } from '@/components/notifications/notification-table-suspense'
import { NotificationTableSuspense } from '@/components/notifications/notification-table-suspense'
import { getNotifications } from '@/services/notifications'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from './loading'

export const metadata: Metadata = {
  title: 'Notifications - SSR',
  description: 'Server-side rendered notifications with Suspense',
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
  const page = Number(params.page ?? 1)
  const limit = Number(params.limit ?? 10)

  // Fetch initial data on the server
  const initialData = await getNotifications({ page, limit })

  return (
    <Suspense fallback={<Loading />}>
      <NotificationTableSuspense
        initialPage={page}
        initialLimit={limit}
        initialData={initialData}
      />
    </Suspense>
  )
}

export default Page