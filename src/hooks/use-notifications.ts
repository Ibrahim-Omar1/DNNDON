import {
  addNotification,
  deleteNotification,
  getNotifications,
  notificationsQueryKey,
  NotificationsResponse,
  updateNotification,
} from '@/services/notifications'
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Custom hook for fetching notifications with pagination
 *
 * Uses TanStack Query for data fetching, caching, and state management.
 * Implements server-side pagination.
 *
 * @param {UseNotificationsParams} params - Query parameters for pagination
 * @param {number} params.page - Current page number for pagination
 * @param {number} params.limit - Number of items per page
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { data, isLoading } = useNotifications()
 *
 * // With and pagination
 * const { data, isLoading } = useNotifications({
 *   page: 1,
 *   limit: 10
 * })
 * ```
 *
 * @returns Query result object containing:
 * - data: NotificationsResponse object with notifications and metadata
 * - isLoading: Boolean indicating initial loading state
 * - isFetching: Boolean indicating background refetch state
 * - isError: Boolean indicating error state
 * - error: Error object if query failed
 * - refetch: Function to manually refetch data
 */
const useNotifications = (params: {
  page?: number
  limit?: number
}): UseQueryResult<NotificationsResponse, Error> => {
  return useQuery({
    queryKey: notificationsQueryKey(params),
    queryFn: () => getNotifications(params),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    _optimisticResults: 'optimistic',
    placeholderData: (prev) => prev, // Add this to keep previous data while loading new data
  })
}

/**
 * Custom hook to get cached notifications data.
 *
 * This hook attempts to retrieve notification data from the TanStack Query cache.
 * If the data is not available in the cache, it fetches the data using the `useNotifications` hook.
 *
 * @returns {NotificationsResponse | undefined} The cached notification data, or undefined if not available.
 */
const useGetCachedNotifications = (): NotificationsResponse | undefined => {
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<NotificationsResponse>(['notifications'])

  // if (!data) {
  //   const { data: newData } = useNotifications({
  //     page: 1,
  //     limit: 10,
  //   })
  //   return newData
  // }

  return data
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
 * @returns  Mutation result object containing:
 * - mutate: Function to trigger the mutation
 * - isPending: Boolean indicating loading state
 * - isError: Boolean indicating error state
 * - error: Error object if mutation failed
 */
const useAddNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addNotification,
    onSuccess: async () => {
      // Invalidate and refetch all notification queries
      await queryClient.invalidateQueries({
        queryKey: ['notifications'],
        refetchType: 'all',
      })
      toast.success('Notification added successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add notification')
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
 * @returns  Mutation result object containing:
 * - mutate: Function to trigger the deletion
 * - isPending: Boolean indicating loading state
 * - isError: Boolean indicating error state
 * - error: Error object if deletion failed
 */
const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteNotification(id)
      if (!response) {
        throw new Error('Failed to delete notification')
      }
      return response
    },
    onSuccess: async () => {
      // Invalidate and refetch all notification queries
      await queryClient.invalidateQueries({
        queryKey: ['notifications'],
        refetchType: 'all',
      })
      toast.success('Notification deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete notification')
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
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await updateNotification(id, data)
      if (!response) {
        throw new Error('Failed to update notification')
      }
      return response
    },
    onSuccess: async () => {
      // Invalidate and refetch all notification queries
      await queryClient.invalidateQueries({
        queryKey: ['notifications'],
        refetchType: 'all',
      })

      toast.success('Notification updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update notification')
    },
  })
}

/**
 * Custom hook for fetching notifications with Suspense
 *
 * Uses TanStack Query's useSuspenseQuery for data fetching with Suspense integration.
 * Data is guaranteed to be available when component renders.
 */
const useSuspenseNotifications = (params: {
  page?: number
  limit?: number
  initialData?: NotificationsResponse
  initialDataUpdatedAt?: number
}) => {
  return useSuspenseQuery({
    queryKey: notificationsQueryKey(params),
    queryFn: () => getNotifications(params),
    staleTime: 0, // Always fetch new data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    initialData: params.initialData,
    initialDataUpdatedAt: params.initialDataUpdatedAt,
  })
}

export {
  useAddNotification,
  useDeleteNotification,
  useGetCachedNotifications,
  useNotifications,
  useSuspenseNotifications,
  useUpdateNotification,
}
