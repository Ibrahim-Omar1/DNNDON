'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table/data-table'
import { useNotifications } from '@/hooks/use-notifications'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { AddNotificationModal } from './notifications/add-notification-modal'
import { columns } from './notifications/columns'

/**
 * NotificationTable Component
 *
 * A data table component that displays notifications with filtering, sorting, and pagination.
 * Uses React Query for data fetching and state management.
 *
 * Features:
 * - Server-side pagination
 * - Server-side sorting
 * - Server-side filtering
 * - Real-time data updates
 * - Loading states
 * - Error handling
 *
 * @example
 * ```tsx
 * <NotificationTable />
 * ```
 */

export function NotificationTable({ initialPage = 1, initialLimit = 10 }: { initialPage?: number, initialLimit?: number }) {
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || initialPage
  const limit = Number(searchParams.get('limit')) || initialLimit

  const [addModalOpen, setAddModalOpen] = useState(false)

  const { data, isLoading, isError, refetch, isFetching } = useNotifications({
    page,
    limit,
  })

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Failed to load notifications</p>
        <Button onClick={() => refetch()} variant="outline">
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Notification
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        totalCount={data?.metadata?.totalCount || 0}
        onRefresh={refetch}
        isRefetching={isFetching}
        filterableColumns={[
          {
            id: 'status',
            title: 'Status',
            options: [
              { label: 'Delivered', value: 'Delivered' },
              { label: 'In Progress', value: 'In Progress' },
              { label: 'Cancelled', value: 'Cancelled' },
            ],
          },
          {
            id: 'type',
            title: 'Type',
            options: [
              { label: 'Photo', value: 'Photo' },
              { label: 'Text', value: 'Text' },
            ],
          },
        ]}
      />
      <AddNotificationModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </div>
  )
}
