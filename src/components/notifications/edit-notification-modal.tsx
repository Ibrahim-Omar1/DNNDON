'use client'

import { type Notification } from '@/types/notifications.types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateNotification } from '@/hooks/use-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const notificationSchema = z.object({
  type: z.enum(['Photo', 'Text']),
  space: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  status: z.enum(['Delivered', 'In Progress', 'Cancelled']),
  // id and dateTime are handled separately
})

type NotificationFormData = z.infer<typeof notificationSchema>

interface EditNotificationModalProps {
  notification: Notification
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditNotificationModal({
  notification,
  open,
  onOpenChange,
}: EditNotificationModalProps) {
  const { mutate: updateNotification, isPending } = useUpdateNotification()

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      type: notification.type,
      space: notification.space,
      country: notification.country,
      city: notification.city,
      status: notification.status,
    },
  })

  const onSubmit = (data: any) => {
    updateNotification(
      { id: notification.id, data },
      {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Notification</DialogTitle>
            <DialogDescription>Update the notification details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type">Type</label>
              <Select
                value={form.watch('type')}
                onValueChange={(value: 'Photo' | 'Text') => form.setValue('type', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Photo">Photo</SelectItem>
                  <SelectItem value="Text">Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Other form fields similar to AddNotificationModal */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status">Status</label>
              <Select
                value={form.watch('status')}
                onValueChange={(value: 'Delivered' | 'In Progress' | 'Cancelled') =>
                  form.setValue('status', value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
