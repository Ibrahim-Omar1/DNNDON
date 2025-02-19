import { Notification } from "@/components/notifications/columns"

/**
 * Response type for notifications API
 */
export interface NotificationsResponse {
  /** Array of notification objects */
  data: Notification[]
  /** Metadata for pagination and total counts */
  metadata: {
    /** Total number of notifications */
    total: number
    /** Current page number */
    page: number
    /** Number of items per page */
    limit: number
    /** Total number of pages */
    totalPages: number
    /** Whether there are more pages */
    hasMore: boolean
  }
}

/**
 * Parameters for fetching notifications
 */
export interface FetchNotificationsParams {
  /** Search query string */
  query?: string
  /** Filter by status */
  status?: string
  /** Filter by type */
  type?: string
  /** Page number */
  page?: number
  /** Items per page */
  limit?: number
  /** Sort column */
  sort?: string
  /** Sort order */
  order?: 'asc' | 'desc'
}

/**
 * Fetches notifications from the API with filtering, pagination, and sorting
 * 
 * @param params - Query parameters for filtering, pagination, and sorting
 * @returns Promise with notifications data and metadata
 * @throws Error if the API request fails
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
export async function getNotifications(params: FetchNotificationsParams = {}): Promise<NotificationsResponse> {
  const searchParams = new URLSearchParams()
  
  // Add params to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString())
    }
  })

  try {
    const response = await fetch(`/api/notifications?${searchParams.toString()}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to fetch notifications"
    )
  }
}

/**
 * Query key factory for notifications
 */
export const notificationsQueryKey = (params: FetchNotificationsParams = {}) => 
  ['notifications', params] as const 

export async function addNotification(data: Partial<Notification>): Promise<Notification> {
  try {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to add notification"
    )
  }
} 