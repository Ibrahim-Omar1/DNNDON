import { getNotifications, notificationsQueryKey } from "@/services/notifications"
import { useQuery } from "@tanstack/react-query"

interface UseNotificationsParams {
  query?: string
  status?: string
  type?: string
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

/**
 * Custom hook for fetching and managing notifications data
 * 
 * Uses TanStack Query to handle data fetching, caching, and refetching logic.
 * 
 * @example
 * ```tsx
 * function NotificationsList() {
 *   const { data, isLoading, error } = useNotifications()
 *   
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error loading notifications</div>
 *   
 *   return (
 *     <ul>
 *       {data?.map(notification => (
 *         <li key={notification.id}>{notification.message}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 * 
 * @returns {Object} Query result object containing:
 * - data: Array of notification objects
 * - isLoading: Boolean indicating if data is being fetched
 * - isError: Boolean indicating if an error occurred
 * - error: Error object if query failed
 * - refetch: Function to manually refetch data
 * - isFetching: Boolean indicating if a background refetch is in progress
 * 
 * @see {@link getNotifications} for the underlying data fetching function
 * @see {@link notificationsQueryKey} for the query cache key
 */
export function useNotifications(params: UseNotificationsParams = {}) {
  return useQuery({
    queryKey: notificationsQueryKey(params),
    queryFn: () => getNotifications(params),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  })
}