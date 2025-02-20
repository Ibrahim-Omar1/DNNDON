import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

interface CachedMongoose {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: CachedMongoose | undefined
}

const cached: CachedMongoose = global.mongooseCache ?? {
  conn: null,
  promise: null,
}

if (!global.mongooseCache) {
  global.mongooseCache = cached
}

/**
 * Optimized database connection utility
 * - Implements connection pooling
 * - Handles connection errors
 * - Optimizes connection settings
 * - Implements graceful shutdown
 */
async function dbConnect(): Promise<typeof mongoose> {
  // If we have a connection, return it
  if (cached.conn) {
    return cached.conn
  }

  // If we're already connecting, return the promise
  if (cached.promise) {
    return cached.promise
  }

  const opts = {
    bufferCommands: false, // Disable buffering of commands
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 5, // Maintain at least 5 socket connections
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    heartbeatFrequencyMS: 10000, // Check connection every 10 seconds
    autoIndex: process.env.NODE_ENV !== 'production', // Don't build indexes in production
    retryWrites: true,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  }

  try {
    // Create new connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully')
        return mongoose
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error)
        cached.promise = null
        throw error
      })

    // Set up connection error handler
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error)
      cached.conn = null
      cached.promise = null
    })

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      process.exit(0)
    })

    // Log when connection is lost
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected')
      cached.conn = null
    })

    // Log when connection is reconnected
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected')
    })

    // Store connection
    cached.conn = await cached.promise

    return cached.conn
  } catch (error) {
    // Clear cache on error
    cached.promise = null
    cached.conn = null
    throw error
  }
}

// Add utility methods
dbConnect.clearCache = () => {
  cached.conn = null
  cached.promise = null
}

dbConnect.getConnection = () => cached.conn

dbConnect.isConnected = () => {
  return mongoose.connection.readyState === 1
}

export default dbConnect
