# Data Table

A flexible data table component built on top of TanStack Table v8 with server-side pagination.

## Features

- Server-side pagination
- Fixed height with loading states
- Accessible pagination controls
- Customizable page sizes
- URL-based state management
- Proper row number display

## Usage

```tsx
import { DataTable } from "@/components/ui/data-table/data-table"
import { columns } from "./columns"

interface DataTableProps {
  data: YourDataType[]
  loading?: boolean
  pagination: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
}

export function YourDataTable({ data, loading, pagination }: DataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      pagination={pagination}
    />
  )
}
```

## Props

### Root Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | Column definitions for the table |
| `data` | `TData[]` | Data to display in the table |
| `loading` | `boolean` | Loading state of the table |
| `pagination` | `PaginationConfig` | Pagination configuration |

### Pagination Config

```typescript
interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}
```

## Examples

### Basic Server-Side Pagination

```tsx
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DataTable } from "@/components/ui/data-table/data-table"

export function ExampleTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 10

  const { data, isLoading } = useQuery({
    queryKey: ['data', page, limit],
    queryFn: () => fetchData({ page, limit })
  })

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

  const handlePageChange = useCallback(
    (newPage: number) => {
      router.push(
        `${pathname}?${createQueryString({ page: newPage, limit })}`,
        { scroll: false }
      )
    },
    [router, pathname, limit, createQueryString]
  )

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      router.push(
        `${pathname}?${createQueryString({ page: 1, limit: newLimit })}`,
        { scroll: false }
      )
    },
    [router, pathname, createQueryString]
  )

  return (
    <DataTable
      columns={columns}
      data={data?.items || []}
      loading={isLoading}
      pagination={{
        page,
        pageSize: limit,
        total: data?.total || 0,
        onPageChange: handlePageChange,
        onPageSizeChange: handleLimitChange,
      }}
    />
  )
}
```

### Fixed Height Loading State

The table maintains a fixed height of 400px in all states:
- Loading spinner during data fetch
- Data display when loaded
- Empty state message when no results

```tsx
<DataTable
  columns={columns}
  data={[]}
  loading={true}
  pagination={{
    page: 1,
    pageSize: 10,
    total: 0,
    onPageChange: () => {},
    onPageSizeChange: () => {},
  }}
/>
```

## Customization

### Page Size Options

The default page size options are [10, 20, 30, 40, 50]. You can customize these in the DataTablePagination component:

```tsx
const pageSizeOptions = [5, 10, 25, 50, 100]
```

### Loading Spinner

The loading spinner can be customized by modifying the SVG in the DataTable component:

```tsx
<div className="flex items-center justify-center h-full">
  <svg className="animate-spin h-6 w-6 text-muted-foreground">
    {/* Your custom spinner SVG */}
  </svg>
</div>
```

## Notes

- The table uses URL-based state management for pagination
- Page size changes reset to page 1
- The table maintains its state between route changes
- Loading states maintain consistent layout
- Row numbers are calculated based on current page and page size 