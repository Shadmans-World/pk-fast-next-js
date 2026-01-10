


import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("MONGODB_URL is not defined");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDb = async () => {
  // reuse existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // create new connection
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      bufferCommands: false, // prevents buffering timeout
    });
  }

  // wait for connection
  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDb;
