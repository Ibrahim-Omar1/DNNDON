'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table/data-table'
import { useSuspenseNotifications } from '@/hooks/use-notifications'
import { cn } from '@/lib/utils'
import { NotificationsResponse } from '@/services/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { AddNotificationModal } from './add-notification-modal'
import { columns } from './columns'

interface NotificationTableSuspenseProps {
  initialPage?: number
  initialLimit?: number
  initialData?: NotificationsResponse
}

export function NotificationTableSuspense({
  initialPage = 1,
  initialLimit = 10,
  initialData,
}: NotificationTableSuspenseProps) {
  const [addModalOpen, setAddModalOpen] = useState(false)

  const { data, refetch, isFetching } = useSuspenseNotifications({
    page: initialPage,
    limit: initialLimit,
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined, // Mark when the initial data was received
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Total Notifications:{' '}
            <span className="flex items-center gap-2">
              {data.metadata.totalCount}
            </span>
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 min-w-[130px]"
          >
            <RefreshCcw className={cn('h-4 w-4', isFetching ? 'animate-spin' : '')} />
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button size="sm" onClick={() => setAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Notification
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data.data}
        totalCount={data.metadata.totalCount}
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