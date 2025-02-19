import { Notification } from "@/components/notifications/columns"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * Mock database for notifications
 * In a real application, this would be replaced with a proper database
 * @type {Notification[]}
 */
const notifications: Notification[] = [
  {
    id: "1",
    type: "Photo",
    space: "230 X 500 PX",
    country: "Saudi Arabia",
    city: "Riyadh",
    dateTime: "14, Jan, 2025 - 11:08 PM",
    status: "Delivered",
  },
  {
    id: "2",
    type: "Text",
    space: "PX 230 X 500",
    country: "United Arab Emirates",
    city: "Dubai",
    dateTime: "14, Jan, 2025 - 10:30 PM",
    status: "In Progress",
  },
  {
    id: "3",
    type: "Text",
    space: "PX 230 X 500",
    country: "Kuwait",
    city: "Kuwait City",
    dateTime: "14, Jan, 2025 - 09:45 PM",
    status: "Cancelled",
  },
  {
    id: "4",
    type: "Photo",
    space: "PX 230 X 500",
    country: "Qatar",
    city: "Doha",
    dateTime: "14, Jan, 2025 - 09:15 PM",
    status: "Delivered",
  },
  {
    id: "5",
    type: "Text",
    space: "PX 230 X 500",
    country: "Bahrain",
    city: "Manama",
    dateTime: "14, Jan, 2025 - 08:50 PM",
    status: "In Progress",
  },
  {
    id: "6",
    type: "Photo",
    space: "230 X 500 PX",
    country: "Oman",
    city: "Muscat",
    dateTime: "14, Jan, 2025 - 08:20 PM",
    status: "Delivered",
  },
  {
    id: "7",
    type: "Text",
    space: "PX 230 X 500",
    country: "Egypt",
    city: "Cairo",
    dateTime: "14, Jan, 2025 - 07:45 PM",
    status: "In Progress",
  },
  {
    id: "8",
    type: "Photo",
    space: "230 X 500 PX",
    country: "Jordan",
    city: "Amman",
    dateTime: "14, Jan, 2025 - 07:15 PM",
    status: "Cancelled",
  },
  {
    id: "9",
    type: "Text",
    space: "PX 230 X 500",
    country: "Lebanon",
    city: "Beirut",
    dateTime: "14, Jan, 2025 - 06:40 PM",
    status: "Delivered",
  },
  {
    id: "10",
    type: "Photo",
    space: "230 X 500 PX",
    country: "Iraq",
    city: "Baghdad",
    dateTime: "14, Jan, 2025 - 06:10 PM",
    status: "In Progress",
  },
  {
    id: "11",
    type: "Text",
    space: "PX 230 X 500",
    country: "Yemen",
    city: "Sanaa",
    dateTime: "14, Jan, 2025 - 05:35 PM",
    status: "Cancelled",
  },
  {
    id: "12",
    type: "Photo",
    space: "230 X 500 PX",
    country: "Syria",
    city: "Damascus",
    dateTime: "14, Jan, 2025 - 05:00 PM",
    status: "Delivered",
  },
  {
    id: "13",
    type: "Text",
    space: "PX 230 X 500",
    country: "Palestine",
    city: "Gaza",
    dateTime: "14, Jan, 2025 - 04:25 PM",
    status: "In Progress",
  },
  {
    id: "14",
    type: "Photo",
    space: "230 X 500 PX",
    country: "Libya",
    city: "Tripoli",
    dateTime: "14, Jan, 2025 - 03:50 PM",
    status: "Cancelled",
  },
  {
    id: "15",
    type: "Text",
    space: "PX 230 X 500",
    country: "Tunisia",
    city: "Tunis",
    dateTime: "14, Jan, 2025 - 03:15 PM",
    status: "Delivered",
  },
]

/**
 * GET handler for notifications with server-side pagination
 * 
 * @param {NextRequest} req - The incoming request object
 * 
 * @example
 * ```ts
 * GET /api/notifications?page=1&limit=10
 * ```
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    
    // Await searchParams values
    const pageParam = await searchParams.get("page")
    const limitParam = await searchParams.get("limit")
    
    // Use nullish coalescing for defaults
    const page = Number(pageParam ?? "1")
    const limit = Number(limitParam ?? "10")

    // Calculate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = notifications.slice(startIndex, endIndex)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      data: paginatedData,
      metadata: {
        total: notifications.length,
        page,
        limit,
        totalPages: Math.ceil(notifications.length / limit),
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
 * POST handler for creating new notifications
 * 
 * Validates required fields and generates:
 * - Unique ID
 * - Timestamp
 * - Default status
 * 
 * @param {NextRequest} req - The incoming request object
 * 
 * @example
 * ```ts
 * POST /api/notifications
 * {
 *   "type": "Photo",
 *   "space": "230 X 500 PX",
 *   "country": "UAE",
 *   "city": "Dubai"
 * }
 * ```
 * 
 * @returns {Promise<NextResponse>} JSON response containing the created notification
 * @throws {NextResponse} 
 * - 400 status code on validation error
 * - 500 status code on server error
 */
export async function POST(req: NextRequest) {
  try {
    const newNotification = await req.json()

    // Validate required fields
    if (!newNotification.type || !newNotification.country || !newNotification.city) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create complete notification object
    const notification: Notification = {
      ...newNotification,
      id: crypto.randomUUID(),
      dateTime: newNotification.dateTime || new Date().toLocaleString(),
      status: newNotification.status || "In Progress",
    }

    // Add to notifications array
    notifications.unshift(notification)
    revalidateTag('notifications')

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error("Error adding notification:", error)
    return NextResponse.json(
      { error: "Failed to add notification" },
      { status: 500 }
    )
  }
}

/**
 * DELETE handler for removing notifications
 * 
 * Removes a notification by ID and revalidates the cache
 * 
 * @param - The incoming request object
 * 
 * @example
 * ```ts
 * DELETE /api/notifications?id=notification-id
 * ```
 * 
 * @returns JSON response indicating success
 * @throws
 * - 400 status code if ID is missing
 * - 404 status code if notification not found
 * - 500 status code on server error
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: "Missing notification ID" },
        { status: 400 }
      )
    }

    const index = notifications.findIndex(n => n.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      )
    }

    notifications.splice(index, 1)
    revalidateTag('notifications')

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    )
  }
}

/**
 * PUT handler for updating notifications
 * 
 * Updates an existing notification by ID and revalidates the cache.
 * Automatically updates the timestamp when changes are made.
 * 
 * @param {NextRequest} req - The incoming request object
 * 
 * @example
 * ```ts
 * PUT /api/notifications?id=notification-id
 * {
 *   "status": "Delivered",
 *   "city": "New City"
 * }
 * ```
 * 
 * @returns {Promise<NextResponse>} JSON response containing the updated notification
 * @throws {NextResponse}
 * - 400 status code if ID is missing
 * - 404 status code if notification not found
 * - 500 status code on server error
 */
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const id = searchParams.get('id')
    const updates = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "Missing notification ID" },
        { status: 400 }
      )
    }

    const index = notifications.findIndex(n => n.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      )
    }

    // Update notification with new timestamp
    notifications[index] = {
      ...notifications[index],
      ...updates,
      dateTime: new Date().toLocaleString(),
    }

    revalidateTag('notifications')

    return NextResponse.json(notifications[index])
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    )
  }
}

/**
 * Example usage:
 * /api/notifications?query=dubai&status=Delivered&type=Photo&page=1&limit=10&sort=dateTime&order=desc
 */ 