import mongoose from "mongoose";

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@${process.env.MONGODB_USERNAME}.nttr8.mongodb.net/?retryWrites=true&w=majority&appName=GolproBD`;

if (!MONGODB_URI) {
  throw new Error("Add MongoDB URI to .env file");
}

const cached = global.mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
