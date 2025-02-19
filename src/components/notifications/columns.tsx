'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ColumnDef, Row } from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, ChevronUp, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { useState } from 'react'
import { DeleteNotificationDialog } from './delete-notification-dialog'
import { EditNotificationModal } from './edit-notification-modal'
import { type Notification } from '@/types/notifications.types'

export const columns: ColumnDef<Notification>[] = [
  {
    id: 'number',
    header: '#',
    cell: ({ row }) => {
      return <div className="text-sm text-muted-foreground w-10">{row.index + 1}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1"
        >
          Notification Type
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      )
    },
  },
  {
    accessorKey: 'space',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center gap-1"
        >
          Notification Space
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      )
    },
  },
  {
    accessorKey: 'country',
    header: 'Country',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'dateTime',
    header: 'Date & Time',
  },
  {
    id: 'status',
    header: 'Status',
    cell: StatusCell,
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
]

function StatusCell({ row }: { row: Row<Notification> }) {
  const status = row.getValue('status') as string
  return (
    <span
      className={`
        inline-flex rounded-full px-3 py-1 text-xs font-medium
        ${
          status === 'Delivered'
            ? 'bg-green-50 text-green-600'
            : status === 'In Progress'
              ? 'bg-yellow-50 text-yellow-600'
              : 'bg-red-50 text-red-500'
        }
      `}
    >
      {status}
    </span>
  )
}

function ActionsCell({ row }: { row: Row<Notification> }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const notification = row.original

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditModal(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditNotificationModal
        notification={notification}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />

      <DeleteNotificationDialog
        notificationId={notification.id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
