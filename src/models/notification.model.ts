import mongoose, { Document } from 'mongoose'

// Interface for the Notification document
export interface INotification extends Document {
  type: 'Photo' | 'Text'
  space: string
  country: string
  city: string
  dateTime: Date
  status: 'Delivered' | 'In Progress' | 'Cancelled'
}

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['Photo', 'Text'],
    },
    space: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Delivered', 'In Progress', 'Cancelled'],
      default: 'In Progress',
    },
  },
  {
    timestamps: true,
  }
)

notificationSchema.index({ dateTime: -1 })

// Prevent OverwriteModelError when model is compiled multiple times in development
const Notification =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema)

export default Notification
