'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'

interface ColumnConfig {
  id: string
  title: string
}

interface FilterableColumn extends ColumnConfig {
  options: {
    label: string
    value: string
  }[]
}

interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSort?: (column: string, order: 'asc' | 'desc') => void
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchableColumns?: ColumnConfig[]
  filterableColumns?: FilterableColumn[]
  loading?: boolean
  totalCount: number
  onRefresh?: () => void
  isRefetching?: boolean
}

/**
 * Case-insensitive filter function for global search
 */
const containsFilter = (value: string, filterValue: string): boolean => {
  return value.toLowerCase().includes(filterValue.toLowerCase())
}

/**
 * A flexible and feature-rich data table component
 *
 * @template TData - Type of the data array
 * @template TValue - Type of the cell values
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   searchableColumns={[
 *     { id: "name", title: "Name" }
 *   ]}
 *   filterableColumns={[
 *     {
 *       id: "status",
 *       title: "Status",
 *       options: [
 *         { label: "Active", value: "active" },
 *         { label: "Inactive", value: "inactive" }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  searchableColumns,
  filterableColumns,
  loading = false,
  totalCount,
  onRefresh,
  isRefetching,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get pagination values from URL
  const page = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('limit')) || 10

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
        `${pathname}?${createQueryString({ page: newPage, limit: pageSize })}`,
        { scroll: false }
      )
    },
    [router, pathname, pageSize, createQueryString]
  )

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      router.push(
        `${pathname}?${createQueryString({ page: 1, limit: newPageSize })}`,
        { scroll: false }
      )
    },
    [router, pathname, createQueryString]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
    state: {
      pagination: {
        pageSize,
        pageIndex: page - 1,
      },
      columnFilters,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const state = typeof updater === 'function' ? updater(table.getState().pagination) : updater
      handlePageChange(state.pageIndex + 1)
      if (state.pageSize !== pageSize) {
        handlePageSizeChange(state.pageSize)
      }
    },
  })

  // Force update table state when pagination props change
  useEffect(() => {
    if (table.getState().pagination.pageIndex !== page - 1) {
      table.setPageIndex(page - 1)
    }
    if (table.getState().pagination.pageSize !== pageSize) {
      table.setPageSize(pageSize)
    }
  }, [page, pageSize, table])

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        totalCount={totalCount}
        onRefresh={onRefresh}
        isRefetching={isRefetching}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-[400px] text-center">
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty state
              <TableRow>
                <TableCell colSpan={columns.length} className="h-[400px] text-center">
                  <div className="flex flex-col items-center justify-center h-full space-y-1">
                    <div className="text-muted-foreground">No results.</div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} totalRows={totalCount} />
    </div>
  )
}
