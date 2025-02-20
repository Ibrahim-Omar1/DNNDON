import {
  addNotification,
  deleteNotification,
  getNotifications,
  notificationsQueryKey,
  NotificationsResponse,
  updateNotification,
} from '@/services/notifications'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Parameters for fetching notifications
 * @interface UseNotificationsParams
 */
interface UseNotificationsParams {
  /** Search query string to filter notifications */
  query?: string
  /** Filter notifications by status */
  status?: string
  /** Filter notifications by type */
  type?: string
  /** Current page number for pagination */
  page?: number
  /** Number of items per page */
  limit?: number
  /** Column to sort by */
  sort?: string
  /** Sort direction */
  order?: 'asc' | 'desc'
}

/**
 * Custom hook for fetching notifications with filtering, sorting, and pagination
 *
 * Uses TanStack Query for data fetching, caching, and state management.
 * Implements server-side filtering, sorting, and pagination.
 *
 * @param {UseNotificationsParams} params - Query parameters for filtering, sorting, and pagination
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { data, isLoading } = useNotifications()
 *
 * // With filters and pagination
 * const { data, isLoading } = useNotifications({
 *   query: "search term",
 *   status: "Delivered",
 *   page: 1,
 *   limit: 10
 * })
 *
 * // With sorting
 * const { data, isLoading } = useNotifications({
 *   sort: "dateTime",
 *   order: "desc"
 * })
 * ```
 *
 * @returns {UseQueryResult} Query result object containing:
 * - data: NotificationsResponse object with notifications and metadata
 * - isLoading: Boolean indicating initial loading state
 * - isFetching: Boolean indicating background refetch state
 * - isError: Boolean indicating error state
 * - error: Error object if query failed
 * - refetch: Function to manually refetch data
 */
const useNotifications = (
  params: UseNotificationsParams = {}
): UseQueryResult<NotificationsResponse, Error> => {
  return useQuery({
    queryKey: notificationsQueryKey(params),
    queryFn: () => getNotifications(params),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev, // Add this to keep previous data while loading new data
  })
}

/**
 * Custom hook for adding new notifications
 *
 * Uses TanStack Query mutations for state updates and cache invalidation.
 * Automatically invalidates and refetches notifications list on success.
 *
 * @example
 * ```tsx
 * const { mutate: addNotification, isPending } = useAddNotification()
 *
 * // Add a new notification
 * addNotification({
 *   type: "Photo",
 *   space: "230 X 500 PX",
 *   country: "UAE",
 *   city: "Dubai"
 * })
 * ```
 *
 * @returns {UseMutationResult} Mutation result object containing:
 * - mutate: Function to trigger the mutation
 * - isPending: Boolean indicating loading state
 * - isError: Boolean indicating error state
 * - error: Error object if mutation failed
 */
const useAddNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * Custom hook for deleting notifications
 *
 * Uses TanStack Query mutations for state updates and cache invalidation.
 * Shows success/error toasts and automatically refetches notifications list.
 *
 * @example
 * ```tsx
 * const { mutate: deleteNotification, isPending } = useDeleteNotification()
 *
 * // Delete a notification
 * deleteNotification("notification-id")
 * ```
 *
 * @returns {UseMutationResult} Mutation result object containing:
 * - mutate: Function to trigger the deletion
 * - isPending: Boolean indicating loading state
 * - isError: Boolean indicating error state
 * - error: Error object if deletion failed
 */
const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('Notification deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete notification')
    },
  })
}

/**
 * Custom hook for updating existing notifications
 *
 * Uses TanStack Query mutations for state updates and cache invalidation.
 * Shows success/error toasts and automatically refetches notifications list.
 *
 * @example
 * ```tsx
 * const { mutate: updateNotification, isPending } = useUpdateNotification()
 *
 * // Update a notification
 * updateNotification({
 *   id: "notification-id",
 *   data: {
 *     status: "Delivered",
 *     city: "New City"
 *   }
 * })
 * ```
 *
 * @returns Mutation result object containing:
 * - mutate: Function to trigger the update
 * - isPending: Boolean indicating loading state
 * - isError: Boolean indicating error state
 * - error: Error object if update failed
 */
const useUpdateNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('Notification updated successfully')
    },
    onError: () => {
      toast.error('Failed to update notification')
    },
  })
}

export { useAddNotification, useDeleteNotification, useNotifications, useUpdateNotification }
