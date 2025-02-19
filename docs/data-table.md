# Data Table Component Documentation

## Overview

A highly customizable data table component built with TanStack Table v8 and Shadcn UI. This component provides enterprise-level features including sorting, filtering, pagination, and column management.

## Core Features

### 1. Global Search
- Real-time search across all columns
- Debounced input for performance
- Case-insensitive matching
- Customizable search fields

### 2. Column Filtering
- Multi-select faceted filters
- Filter counts and badges
- Clear filter options
- Custom filter components

### 3. Sorting
- Multi-column sorting
- Sort direction indicators
- Click-to-sort headers
- Custom sort functions

### 4. Pagination
- Customizable page sizes
- Page navigation
- Results counter
- Responsive design

### 5. Column Management
- Toggle column visibility
- Persistent column state
- Responsive column hiding
- Column reordering (optional)

## Component Architecture

```typescript
src/components/ui/data-table/
├── data-table.tsx              # Main table component
├── data-table-toolbar.tsx      # Search and filters
├── data-table-pagination.tsx   # Pagination controls
├── data-table-faceted-filter.tsx # Faceted filtering
└── data-table-view-options.tsx   # Column visibility
```

## Usage Examples

### Basic Implementation
```typescript
import { DataTable } from "@/components/ui/data-table/data-table"
import { columns } from "./columns"

export function MyDataTable() {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[
        {
          id: "email",
          title: "Email",
        },
      ]}
      filterableColumns={[
        {
          id: "status",
          title: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ],
        },
      ]}
    />
  )
}
```

### Column Definition
```typescript
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
]
```

## Component API

### DataTable Props
```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]  // Column definitions
  data: TData[]                        // Table data
  searchableColumns?: {                // Searchable columns config
    id: string
    title: string
  }[]
  filterableColumns?: {                // Filterable columns config
    id: string
    title: string
    options: {
      label: string
      value: string
    }[]
  }[]
}
```

### Internal State Management
```typescript
const [sorting, setSorting] = useState<SortingState>([])
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
const [globalFilter, setGlobalFilter] = useState("")
```

## Features In Detail

### 1. DataTable Component
```typescript
export function DataTable<TData, TValue>({
  columns,
  data,
  searchableColumns = [],
  filterableColumns = [],
}: DataTableProps<TData, TValue>) {
  // State management
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  // Table configuration
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })
}
```

### 2. Toolbar Component
- Global search input
- Column-specific filters
- View options menu
- Action buttons

### 3. Faceted Filter Component
- Multi-select options
- Search within options
- Selection indicators
- Count badges

### 4. View Options Component
- Column visibility toggles
- Responsive design
- Persistent state

## Styling

### Base Styles
```typescript
// Table wrapper
<div className="space-y-4">
  {/* Toolbar */}
  <div className="flex items-center justify-between p-4">
    {/* ... */}
  </div>

  {/* Table */}
  <div className="rounded-md border">
    <Table>
      {/* ... */}
    </Table>
  </div>

  {/* Pagination */}
  <div className="flex items-center justify-between px-4 py-4">
    {/* ... */}
  </div>
</div>
```

### Customization Options
- Tailwind CSS classes
- CSS variables
- Theme customization
- Component variants

## Performance Optimization

### 1. Data Handling
- Virtualization for large datasets
- Debounced search input
- Memoized rendering
- Efficient state updates

### 2. Filter Performance
- Faceted filtering
- Cached filter results
- Optimized search algorithm

### 3. Sort Performance
- Memoized sort functions
- Stable sort implementation
- Sort state management

## Accessibility

### ARIA Attributes
- Role definitions
- State descriptions
- Focus management
- Keyboard navigation

### Keyboard Support
- Arrow key navigation
- Sort toggles
- Filter interactions
- Column management

## Best Practices

### 1. Data Structure
```typescript
interface DataItem {
  id: string          // Unique identifier
  [key: string]: any  // Additional fields
}

// Consistent data shape
const data: DataItem[] = [
  {
    id: "1",
    name: "Item 1",
    status: "active",
  },
]
```

### 2. Column Configuration
```typescript
const columns: ColumnDef<DataItem>[] = [
  {
    accessorKey: "name",
    enableSorting: true,
    enableFiltering: true,
  },
]
```

### 3. Filter Implementation
```typescript
const filterableColumns = [
  {
    id: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
]
```

## Error Handling

### 1. Data Validation
- Type checking
- Null value handling
- Default values

### 2. UI Feedback
- Loading states
- Error messages
- Empty states
- Filter feedback

## Integration Tips

### 1. Server Integration
```typescript
async function fetchData() {
  const response = await fetch('/api/data')
  const data = await response.json()
  return data
}
```

### 2. State Management
```typescript
// External state management
const [data, setData] = useState<DataItem[]>([])
const [isLoading, setIsLoading] = useState(false)
```

### 3. Event Handling
```typescript
// Custom sort handler
function handleSort(column: string, direction: 'asc' | 'desc') {
  // Implementation
}
```

## Common Patterns

### 1. Custom Cell Rendering
```typescript
{
  accessorKey: "status",
  cell: ({ row }) => (
    <Badge variant={row.getValue("status")}>
      {row.getValue("status")}
    </Badge>
  ),
}
```

### 2. Action Columns
```typescript
{
  id: "actions",
  cell: ({ row }) => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
```

## Troubleshooting

### Common Issues
1. Type mismatches
2. Filter not working
3. Sort not updating
4. Column visibility issues

### Solutions
1. Check type definitions
2. Verify filter configuration
3. Confirm sort state management
4. Review column visibility setup 