'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'
import { Search, X } from 'lucide-react'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

// Define interfaces locally instead of importing from @tanstack/react-table
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

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumns?: FilterableColumn[]
  totalCount: number
  onRefresh?: () => void
  isRefetching?: boolean
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  globalFilter = '',
  onGlobalFilterChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* Global Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search all..."
              value={globalFilter}
              onChange={(event) => onGlobalFilterChange?.(event.target.value)}
              className="pl-9 h-9 w-[150px] lg:w-[250px] bg-gray-50/50 border-gray-200 focus-visible:ring-gray-200"
            />
          </div>

          {/* Column Filters */}
          {filterableColumns.length > 0 &&
            filterableColumns.map((column) => {
              const columnFilter = table.getColumn(column.id)
              if (!columnFilter) return null

              return (
                <DataTableFacetedFilter
                  key={column.id}
                  column={columnFilter}
                  title={column.title}
                  options={column.options}
                />
              )
            })}
          {(isFiltered || globalFilter) && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters()
                onGlobalFilterChange?.('')
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
