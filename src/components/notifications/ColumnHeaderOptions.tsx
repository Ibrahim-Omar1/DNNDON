import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Notification } from '@/types/notifications.types'
import { Column } from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react'

const ColumnHeaderOptions = ({ column }: { column: Column<Notification> }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 p-0">
          <span className="capitalize"> {column.id}</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>Ascending</DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>Descending</DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.clearSorting()}>None</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ColumnHeaderOptions
