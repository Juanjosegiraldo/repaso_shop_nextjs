import mongoose from "mongoose";

/**
 * Opens a direct connection to MongoDB using MONGODB_URI.
 *
 * Mongoose holds a single internal connection per process. If a connection is
 * already open (readyState === 1) this becomes a no-op, so a simple direct
 * connection is enough — there is no need for a global promise cache.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  // Already connected: reuse the existing connection.
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("DB Online");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Database connection failed: ${message}`);
  }
}
