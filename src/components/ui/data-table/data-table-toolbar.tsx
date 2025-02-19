"use client"

import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import { Button } from "@/components/ui/button"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchableColumns?: {
    id: string
    title: string
  }[]
  filterableColumns?: any[]
}

export function DataTableToolbar<TData>({
  table,
  searchableColumns,
  filterableColumns,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns && searchableColumns.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${searchableColumns[0].title}...`}
              value={(table.getColumn(searchableColumns[0].id)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchableColumns[0].id)?.setFilterValue(event.target.value)
              }
              className="pl-9 h-9 w-[300px] bg-gray-50/50 border-gray-200 focus-visible:ring-gray-200"
            />
          </div>
        )}
        {filterableColumns?.map(({ id, title, options }) => (
          <DataTableFacetedFilter
            key={id}
            column={table.getColumn(id)}
            title={title}
            options={options}
          />
        ))}
      </div>
      <DataTableViewOptions table={table} />
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset filters
        </Button>
      )}
    </div>
  )
} 