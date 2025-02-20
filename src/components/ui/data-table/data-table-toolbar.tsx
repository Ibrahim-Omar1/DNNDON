'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'
import { RefreshCcw, Search, X } from 'lucide-react'
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
  searchableColumns?: ColumnConfig[]
  filterableColumns?: FilterableColumn[]
  totalCount: number
  onRefresh?: () => void
  isRefetching?: boolean
}

export function DataTableToolbar<TData>({
  table,
  searchableColumns = [],
  filterableColumns = [],
  totalCount,
  onRefresh,
  isRefetching,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Total: {totalCount}</h2>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefetching}
            className="gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Refreshing...' : 'Refresh'}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between p-4">
        <div className="flex flex-1 items-center space-x-2">
          {searchableColumns.length > 0 &&
            searchableColumns.map((column) => (
              <div key={column.id} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Search ${column.title}...`}
                  value={(table.getColumn(column.id)?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn(column.id)?.setFilterValue(event.target.value)
                  }
                  className="pl-9 h-9 w-[150px] lg:w-[250px] bg-gray-50/50 border-gray-200 focus-visible:ring-gray-200"
                />
              </div>
            ))}
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
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
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
