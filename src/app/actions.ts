'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateNotifications() {
  revalidateTag('notifications')
}
