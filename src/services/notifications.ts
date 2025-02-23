import { type Notification } from '@/types/notifications.types'
import { revalidateTag } from 'next/cache'

/**
 * Response type for notifications API
 */
export interface NotificationsResponse {
  data: Notification[]
  metadata: {
    currentPage: number
    totalPages: number
    pageSize: number
    totalCount: number
  }
}

/**
 * Parameters for fetching notifications
 */
export interface FetchNotificationsParams {
  query?: string
  status?: string
  type?: string
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

/**
 * Get the base URL for API requests
 */
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

/**
 * Fetches notifications from the API with filtering, pagination, and sorting.
 *
 * @param params - Query parameters for filtering, pagination, and sorting.
 * @returns <NotificationsResponse> Promise with notifications data and metadata.
 * @throws Error if the API request fails.
 *
 * @example
 * ```ts
 * // Fetch first page of delivered notifications
 * const response = await getNotifications({
 *   page: 1,
 *   limit: 10,
 *   status: 'Delivered'
 * })
 * ```
 */
const getNotifications = async (
  params: FetchNotificationsParams
): Promise<NotificationsResponse> => {
  const searchParams = new URLSearchParams()

  // Add pagination params
  if (params.page) searchParams.append('page', params.page.toString())
  if (params.limit) searchParams.append('limit', params.limit.toString())

  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/notifications?${searchParams.toString()}`, {
      next: {
        revalidate: 0,
        tags: ['notifications'],
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch notifications')
  }
}

/**
 * Query key factory for notifications
 */
export const notificationsQueryKey = (params: FetchNotificationsParams = {}) =>
  ['notifications', params] as const

/**
 * Adds a new notification.
 *
 * @param data - Partial notification data to add.
 * @returns Promise with the added notification.
 * @throws Error if the API request fails.
 */
const addNotification = async (data: Partial<Notification>): Promise<Notification> => {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Revalidate the notifications cache
    await revalidateTag('notifications')
    return response.json()
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add notification')
  }
}

/**
 * Deletes a notification by ID.
 *
 * @param id - ID of the notification to delete.
 * @returns Promise that resolves when the notification is deleted.
 * @throws Error if the API request fails.
 */
const deleteNotification = async (id: string): Promise<boolean> => {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/notifications?id=${id}`, {
      method: 'DELETE',
    })
    const responseData = await response.json()
    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to delete notification')
    }

    return true
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete notification')
  }
}

/**
 * Updates an existing notification by ID.
 *
 * @param id - ID of the notification to update.
 * @param data - Partial notification data to update.
 * @returns Promise with the updated notification.
 * @throws Error if the API request fails.
 */
const updateNotification = async (
  id: string,
  data: Partial<Notification>
): Promise<Notification> => {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/notifications?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to update notification')
    }

    return responseData
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update notification')
  }
}

export { addNotification, deleteNotification, getNotifications, updateNotification }

