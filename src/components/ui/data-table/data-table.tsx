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
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type OnChangeFn,
} from "@tanstack/react-table"
import { useState } from "react"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

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
const containsFilter: FilterFn<any> = (row, columnId, value) => {
  const cellValue = row.getValue(columnId)
  if (cellValue == null) return false

  return String(cellValue)
    .toLowerCase()
    .includes(String(value).toLowerCase())
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
  searchableColumns = [],
  filterableColumns = [],
  loading = false,
  pagination,
  sorting,
  onSearch,
  onFilter,
}: DataTableProps<TData, TValue>) {
  // State management
  const [tableSorting, setTableSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState({})
  const [columnPinning, setColumnPinning] = useState({})

  /**
   * Handles sorting state changes and converts between table sorting and custom sorting
   */
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    // Handle both function updater and direct value
    const newSorting = typeof updater === 'function' ? updater(tableSorting) : updater
    setTableSorting(newSorting)

    // Convert table sorting to custom sorting format
    if (newSorting.length > 0 && sorting?.onSort) {
      const { id, desc } = newSorting[0]
      sorting.onSort(id, desc ? 'desc' : 'asc')
    } else if (newSorting.length === 0 && sorting?.onSort) {
      // Clear sorting
      sorting.onSort('', 'asc')
    }
  }

  const table = useReactTable({
    data,
    columns,

    // Core features
    getCoreRowModel: getCoreRowModel(),

    // Pagination features
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: Boolean(pagination), // Enable manual pagination when prop is provided
    pageCount: pagination ? Math.ceil(pagination.total / pagination.pageSize) : undefined,
    onPaginationChange: (updater) => {
      const state = table.getState()
      if (pagination?.onPageChange) {
        pagination.onPageChange(state.pagination.pageIndex + 1)
      }
      if (pagination?.onPageSizeChange) {
        pagination.onPageSizeChange(state.pagination.pageSize)
      }
    },

    // Sorting features
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: handleSortingChange,
    manualSorting: Boolean(sorting), // Enable manual sorting when prop is provided

    // Filtering features
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: containsFilter,
    manualFiltering: Boolean(onFilter),

    // Row selection features
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,

    // Column management
    enableColumnResizing: true,
    enableHiding: true,
    onColumnVisibilityChange: setColumnVisibility,
    enablePinning: true,
    onColumnPinningChange: setColumnPinning,

    // Faceted search features
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    // State management
    state: {
      sorting: tableSorting,
      columnFilters,
      globalFilter,
      rowSelection,
      columnVisibility,
      columnPinning,
    },

    // Initial configuration
    initialState: {
      pagination: {
        pageSize: pagination?.pageSize || 10,
        pageIndex: (pagination?.page || 1) - 1,
      },
      columnVisibility: {
        // Hide any columns marked as hidden by default
        ...columns.reduce((acc, col) => ({
          ...acc,
          [(col as any).id]: !(col as any).hidden,
        }), {}),
      },
    },

    // Debug mode in development
    debugTable: process.env.NODE_ENV === 'development',
    debugHeaders: process.env.NODE_ENV === 'development',
    debugColumns: process.env.NODE_ENV === 'development',
  })

  return (
    <div className="space-y-4">
      {/* Toolbar with search, filters and view options */}
      <DataTableToolbar
        table={table}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      {/* Main table container */}
      <div className="rounded-md border">
        <Table>
          {/* Table Header */}
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

          {/* Table Body */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <DataTablePagination table={table} />
    </div>
  )
} 