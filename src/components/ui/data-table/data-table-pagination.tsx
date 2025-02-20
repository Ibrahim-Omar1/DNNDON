'use client'

import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  totalRows?: number
}

export function DataTablePagination<TData>({ table, totalRows }: DataTablePaginationProps<TData>) {
  const pageSizeOptions = [10, 20, 30, 40, 50]
  const { pageIndex, pageSize } = table.getState().pagination
  const total = totalRows ?? table.getFilteredRowModel().rows.length

  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize)

  // Check if we can navigate
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < totalPages - 1

  // Calculate start and end row numbers
  const startRow = Math.min(pageIndex * pageSize + 1, total)
  const endRow = Math.min((pageIndex + 1) * pageSize, total)

  const createQueryString = (params: Record<string, string | number>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.set(key, String(value))
    })
    return newSearchParams.toString()
  }

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {total > 0
          ? `Showing ${startRow} to ${endRow} of ${total} results`
          : 'No results.'}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              const newSize = Number(value)
              table.setPageSize(newSize)
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pageIndex + 1} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`${pathname}?${createQueryString({ page: 1, limit: pageSize })}`}
            onClick={(e) => {
              if (!canPreviousPage) e.preventDefault()
            }}
            className={buttonVariants({
              variant: 'outline',
              className: 'h-8 w-8 p-0 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
            })}
            aria-disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Link>
          <Link
            href={`${pathname}?${createQueryString({ page: pageIndex, limit: pageSize })}`}
            onClick={(e) => {
              if (!canPreviousPage) e.preventDefault()
            }}
            className={buttonVariants({
              variant: 'outline',
              className: 'h-8 w-8 p-0 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
            })}
            aria-disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link
            href={`${pathname}?${createQueryString({ page: pageIndex + 2, limit: pageSize })}`}
            onClick={(e) => {
              if (!canNextPage) e.preventDefault()
            }}
            className={buttonVariants({
              variant: 'outline',
              className: 'h-8 w-8 p-0 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
            })}
            aria-disabled={!canNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href={`${pathname}?${createQueryString({ page: totalPages, limit: pageSize })}`}
            onClick={(e) => {
              if (!canNextPage) e.preventDefault()
            }}
            className={buttonVariants({
              variant: 'outline',
              className: 'hidden h-8 w-8 p-0 lg:flex aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
            })}
            aria-disabled={!canNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
