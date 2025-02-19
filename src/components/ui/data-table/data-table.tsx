"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table"
import { useEffect } from "react"
import { DataTablePagination } from "./data-table-pagination"

/**
 * Props for configurable columns in the DataTable
 */
interface ColumnConfig {
  /** Unique identifier for the column */
  id: string
  /** Display title for the column */
  title: string
}

/**
 * Props for filterable columns with options
 */
interface FilterableColumn extends ColumnConfig {
  /** Available filter options for the column */
  options: {
    /** Display label for the option */
    label: string
    /** Value for the option */
    value: string
  }[]
}

/**
 * Pagination configuration interface
 */
interface PaginationConfig {
  /** Current page number */
  page: number
  /** Number of items per page */
  pageSize: number
  /** Total number of items */
  total: number
  /** Callback when page changes */
  onPageChange: (page: number) => void
  /** Callback when page size changes */
  onPageSizeChange: (pageSize: number) => void
}

/**
 * Custom sorting configuration interface
 */
interface CustomSorting {
  /** Currently sorted column */
  column?: string
  /** Sort order (ascending or descending) */
  order?: 'asc' | 'desc'
  /** Callback when sort changes */
  onSort: (column: string, order: 'asc' | 'desc') => void
}

/**
 * Props interface for the DataTable component
 * @template TData - Type of the data array
 * @template TValue - Type of the cell values
 */
interface DataTableProps<TData, TValue> {
  /** Column definitions */
  columns: ColumnDef<TData, TValue>[]
  /** Data to display */
  data: TData[]
  /** Columns that can be searched */
  searchableColumns?: ColumnConfig[]
  /** Columns that can be filtered */
  filterableColumns?: FilterableColumn[]
  /** Loading state */
  loading?: boolean
  /** Pagination configuration */
  pagination?: PaginationConfig
  /** Sorting configuration */
  sorting?: CustomSorting
  /** Callback when search query changes */
  onSearch?: (query: string) => void
  /** Callback when filter changes */
  onFilter?: (column: string, value: string) => void
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
  loading = false,
  pagination,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
    },
    filterFns: {
      contains: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as string
        return containsFilter(value, filterValue)
      }
    }
  })

  // Force update table state when URL params change
  useEffect(() => {
    table.setPageIndex(pagination?.page ? pagination.page - 1 : 0)
    table.setPageSize(pagination?.pageSize || 10)
  }, [table, pagination?.page, pagination?.pageSize])

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[400px] text-center"
                >
                  <div className="flex items-center justify-center h-full">
                    <svg
                      className="animate-spin h-6 w-6 text-muted-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[400px] text-center"
                >
                  <div className="flex flex-col items-center justify-center h-full space-y-1">
                    <div className="text-muted-foreground">No results.</div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        totalRows={pagination?.total}
      />
    </div>
  )
} 