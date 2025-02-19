import { Notification } from "@/components/notifications/columns"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

// Mock data with more variety
const notifications: Notification[] = [
  {
    type: "Photo",
    space: "230 X 500 PX",
    country: "Saudi Arabia",
    city: "Riyadh",
    dateTime: "14, Jan, 2025 - 11:08 PM",
    status: "Delivered",
  },
  {
    type: "Text",
    space: "PX 230 X 500",
    country: "United Arab Emirates",
    city: "Dubai",
    dateTime: "14, Jan, 2025 - 10:30 PM",
    status: "In Progress",
  },
  {
    type: "Text",
    space: "PX 230 X 500",
    country: "Kuwait",
    city: "Kuwait City",
    dateTime: "14, Jan, 2025 - 09:45 PM",
    status: "Cancelled",
  },
  {
    type: "Photo",
    space: "PX 230 X 500",
    country: "Qatar",
    city: "Doha",
    dateTime: "14, Jan, 2025 - 09:15 PM",
    status: "Delivered",
  },
  {
    type: "Text",
    space: "PX 230 X 500",
    country: "Bahrain",
    city: "Manama",
    dateTime: "14, Jan, 2025 - 08:50 PM",
    status: "In Progress",
  },
  {
    type: "Photo",
    space: "230 X 500 PX",
    country: "Oman",
    city: "Muscat",
    dateTime: "14, Jan, 2025 - 08:20 PM",
    status: "Delivered",
  },
  {
    type: "Text",
    space: "PX 230 X 500",
    country: "Egypt",
    city: "Cairo",
    dateTime: "14, Jan, 2025 - 07:45 PM",
    status: "In Progress",
  },
  {
    type: "Photo",
    space: "230 X 500 PX",
    country: "Jordan",
    city: "Amman",
    dateTime: "14, Jan, 2025 - 07:15 PM",
    status: "Cancelled",
  },
  {
    type: "Text",
    space: "PX 230 X 500",
    country: "Lebanon",
    city: "Beirut",
    dateTime: "14, Jan, 2025 - 06:40 PM",
    status: "Delivered",
  },
  {
    type: "Photo",
    space: "230 X 500 PX",
    country: "Iraq",
    city: "Baghdad",
    dateTime: "14, Jan, 2025 - 06:10 PM",
    status: "In Progress",
  },
  {
    type: "Text",
    space: "PX 230 X 500",
    country: "Yemen",
    city: "Sanaa",
    dateTime: "14, Jan, 2025 - 05:35 PM",
    status: "Cancelled",
  },
  {
    type: "Photo",
    space: "230 X 500 PX",
    country: "Syria",
    city: "Damascus",
    dateTime: "14, Jan, 2025 - 05:00 PM",
    status: "Delivered",
  },
  {
    type: "Text",
    space: "PX 230 X 500",
    country: "Palestine",
    city: "Gaza",
    dateTime: "14, Jan, 2025 - 04:25 PM",
    status: "In Progress",
  },
  {
    type: "Photo",
    space: "230 X 500 PX",
    country: "Libya",
    city: "Tripoli",
    dateTime: "14, Jan, 2025 - 03:50 PM",
    status: "Cancelled",
  },
  {
    type: "Text",
    space: "PX 230 X 500",
    country: "Tunisia",
    city: "Tunis",
    dateTime: "14, Jan, 2025 - 03:15 PM",
    status: "Delivered",
  },
]

/**
 * GET handler for notifications with filtering, pagination, and sorting
 */
export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query")?.toLowerCase()
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sort = searchParams.get("sort")
    const order = searchParams.get("order") || "asc"

    // Filter notifications
    let filteredNotifications = [...notifications]

    // Apply search query filter
    if (query) {
      filteredNotifications = filteredNotifications.filter(
        (notification) =>
          notification.country.toLowerCase().includes(query) ||
          notification.city.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (status) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.status === status
      )
    }

    // Apply type filter
    if (type) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.type === type
      )
    }

    // Apply sorting
    if (sort) {
      filteredNotifications.sort((a: any, b: any) => {
        const aValue = a[sort]
        const bValue = b[sort]
        return order === "asc" 
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1
      })
    }

    // Calculate pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedNotifications = filteredNotifications.slice(start, end)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return response with metadata
    return NextResponse.json({
      data: paginatedNotifications,
      metadata: {
        total: filteredNotifications.length,
        page,
        limit,
        totalPages: Math.ceil(filteredNotifications.length / limit),
        hasMore: end < filteredNotifications.length,
      },
    })
  } catch (error) {
    console.error("Error in notifications API:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

/**
 * Example usage:
 * /api/notifications?query=dubai&status=Delivered&type=Photo&page=1&limit=10&sort=dateTime&order=desc
 */

export async function POST(req: NextRequest) {
  try {
    const newNotification = await req.json()

    // Validate the notification data here
    if (!newNotification.type || !newNotification.country || !newNotification.city) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Add dateTime if not provided
    if (!newNotification.dateTime) {
      newNotification.dateTime = new Date().toLocaleString()
    }

    // Add status if not provided
    if (!newNotification.status) {
      newNotification.status = "In Progress"
    }

    // Add to notifications array
    notifications.unshift(newNotification)

    // Revalidate the notifications cache
    revalidateTag('notifications')

    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    console.error("Error adding notification:", error)
    return NextResponse.json(
      { error: "Failed to add notification" },
      { status: 500 }
    )
  }
} 