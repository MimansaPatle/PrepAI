import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;   // jaise node.js me ik bar save kro to connection ik hi bar hojata hai, pr in next js, har request pe reload hota hai, isliye global variable use karte hai taki hr bar save krne pe multiple connections na bane. Next.js me hot reload ke time pe multiple connections ban jate hai, isliye global variable use karte hai taki ik hi connection ho.

if (!cached) {
  cached = global.mongoose = {       // Use global variable to maintain a cached connection across hot reloads in development
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {           // If a connection is already cached, return it
    return cached.conn;
  }

  if (!cached.promise) {          // If no connection promise is cached, create a new one
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;   //Wait until the connection is complete.

  return cached.conn;
}

export default connectDB;