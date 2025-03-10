export interface Notification {
  id: string
  type: string
  space: string
  country: string
  city: string
  dateTime: string
  status: 'Delivered' | 'In Progress' | 'Cancelled'
}

export interface NotificationResponse {
  data: Notification[]
  metadata: {
    currentPage: number
    totalPages: number
    pageSize: number
    totalCount: number
  }
}
