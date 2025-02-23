import dbConnect from '@/lib/dbConnect'
import Notification from '@/models/notification.model'
import { type NotificationResponse } from '@/types/notifications.types'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

// Cache connection promise
let connectionPromise: Promise<typeof mongoose> | null = null

export const dynamic = 'force-dynamic' // defaults to auto
export const revalidate = 60 // revalidate the data at most every 60 seconds

/**
 * GET handler for notifications with optimized pagination
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
    // Reuse connection promise
    if (!connectionPromise) {
      connectionPromise = dbConnect()
    }
    await connectionPromise

    const searchParams = req.nextUrl.searchParams
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const skip = (page - 1) * limit

    // Execute queries in parallel
    const [notifications, totalCount] = await Promise.all([
      Notification.find()
        .select('type space country city dateTime status') // Select only needed fields
        .sort({ dateTime: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(), // Add exec() for better performance
      Notification.countDocuments().exec(),
    ])

    // Optimize the mapping operation
    const response: NotificationResponse = {
      data: notifications.map((doc) => ({
        id: (doc._id as mongoose.Types.ObjectId).toString(),
        type: doc.type,
        space: doc.space,
        country: doc.country,
        city: doc.city,
        dateTime: new Date(doc.dateTime).toLocaleString(),
        status: doc.status,
      })),
      metadata: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        pageSize: limit,
        totalCount,
      },
    }

    // Return response with proper cache headers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Error in notifications API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  }
}

/**
 * POST handler for creating notifications
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
    if (!connectionPromise) {
      connectionPromise = dbConnect()
    }
    await connectionPromise

    const data = await req.json()
    const notification = await Notification.create(data)

    // Convert to plain object once
    const notificationObj = notification.toObject()

    return NextResponse.json(
      {
        ...notificationObj,
        id: notificationObj._id.toString(),
        dateTime: new Date(notificationObj.dateTime).toLocaleString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding notification:', error)
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to add notification' }, { status: 500 })
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
    if (!connectionPromise) {
      connectionPromise = dbConnect()
    }
    await connectionPromise

    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing notification ID' }, { status: 400 })
    }

    const result = await Notification.findByIdAndDelete(id).exec()
    if (!result) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 })
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
    if (!connectionPromise) {
      connectionPromise = dbConnect()
    }
    await connectionPromise

    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing notification ID' }, { status: 400 })
    }

    const updates = await req.json()
    const notification = await Notification.findByIdAndUpdate(
      id,
      { ...updates, dateTime: new Date() },
      { new: true, runValidators: true }
    ).exec()

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    const notificationObj = notification.toObject()
    return NextResponse.json({
      ...notificationObj,
      id: notificationObj._id.toString(),
      dateTime: new Date(notificationObj.dateTime).toLocaleString(),
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}

/**
 * Example usage:
 * /api/notifications?query=dubai&status=Delivered&type=Photo&page=1&limit=10&sort=dateTime&order=desc
 */
