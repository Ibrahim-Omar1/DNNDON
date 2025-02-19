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
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
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
  pagination?: PaginationConfig
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
  pagination,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination ? Math.ceil(pagination.total / pagination.pageSize) : undefined,
    onPaginationChange: (updater) => {
      const state = typeof updater === 'function' ? updater(table.getState().pagination) : updater

      if (pagination?.onPageChange) {
        pagination.onPageChange(state.pageIndex + 1)
      }
      if (pagination?.onPageSizeChange && state.pageSize !== table.getState().pagination.pageSize) {
        pagination.onPageSizeChange(state.pageSize)
      }
    },
    state: {
      pagination: {
        pageSize: pagination?.pageSize || 10,
        pageIndex: (pagination?.page || 1) - 1,
      },
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      contains: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as string
        return containsFilter(value, filterValue)
      },
    },
  })

  // Force update table state when URL params change
  useEffect(() => {
    table.setPageIndex(pagination?.page ? pagination.page - 1 : 0)
    table.setPageSize(pagination?.pageSize || 10)
  }, [table, pagination?.page, pagination?.pageSize])

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
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
      <DataTablePagination table={table} totalRows={pagination?.total} />
    </div>
  )
}
