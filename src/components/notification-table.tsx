'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table/data-table'
import { useNotifications } from '@/hooks/use-notifications'
import { Plus, RefreshCcw } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
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

interface NotificationTableProps {
  initialPage: number
  initialLimit: number
}

export function NotificationTable({ initialPage, initialLimit }: NotificationTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Use initial values from props
  const page = Number(searchParams.get('page')) || initialPage
  const limit = Number(searchParams.get('limit')) || initialLimit

  // Create URL updater function
  const createQueryString = useCallback(
    (params: Record<string, string | number>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      })

      return newSearchParams.toString()
    },
    [searchParams]
  )

  // Update URL when pagination changes
  const handlePageChange = useCallback(
    (newPage: number) => {
      router.push(
        `${pathname}?${createQueryString({ page: newPage, limit })}`,
        { scroll: false } // Prevent scrolling to top on page change
      )
    },
    [router, pathname, limit, createQueryString]
  )

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      router.push(`${pathname}?${createQueryString({ page: 1, limit: newLimit })}`, {
        scroll: false,
      })
    },
    [router, pathname, createQueryString]
  )

  const [sort, setSort] = useState<{ column?: string; order?: 'asc' | 'desc' }>({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filters, setFilters] = useState<{
    query?: string
    status?: string
    type?: string
  }>({})
  const [addModalOpen, setAddModalOpen] = useState(false)

  const {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data = {} as any,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useNotifications({
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
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Notifications ({data?.metadata?.total || 0})</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
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
        data={data?.data || []}
        loading={isLoading}
        searchableColumns={[
          {
            id: 'country',
            title: 'Country',
          },
        ]}
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
        pagination={{
          page,
          pageSize: limit,
          total: data?.metadata?.total || 0,
          onPageChange: handlePageChange,
          onPageSizeChange: handleLimitChange,
        }}
        sorting={{
          column: sort.column,
          order: sort.order,
          onSort: (column: string, order: 'asc' | 'desc') => setSort({ column, order }),
        }}
        onSearch={(query: string) => setFilters((prev) => ({ ...prev, query }))}
        onFilter={(column: string, value: string) =>
          setFilters((prev) => ({ ...prev, [column]: value }))
        }
      />
      <AddNotificationModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </div>
  )
}
