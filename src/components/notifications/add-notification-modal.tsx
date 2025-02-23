'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAddNotification } from '@/hooks/use-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const notificationSchema = z.object({
  type: z.string().min(1),
  space: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  // id and dateTime will be generated on the server
  // status will default to "In Progress"
})

type NotificationFormData = z.infer<typeof notificationSchema>

interface AddNotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddNotificationModal({ open, onOpenChange }: AddNotificationModalProps) {
  const { mutate: addNotification, isPending } = useAddNotification()

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      type: '',
      space: '',
      country: '',
      city: '',
    },
  })

  const onSubmit = (data: NotificationFormData) => {
    addNotification(data, {
      onSuccess: () => {
        toast.success('Notification added successfully')
        form.reset()
        onOpenChange(false)
      },
      onError: () => {
        toast.error('Failed to add notification')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Notification</DialogTitle>
            <DialogDescription>Create a new notification with the form below.</DialogDescription>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="space">Space</label>
              <Input id="space" className="col-span-3" {...form.register('space')} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="country">Country</label>
              <Input id="country" className="col-span-3" {...form.register('country')} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="city">City</label>
              <Input id="city" className="col-span-3" {...form.register('city')} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add Notification'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
