import mongoose from "mongoose";
import dns from "dns";

// mongodb+srv:// resolves via dns.resolveSrv(), which queries the nameservers
// Node's c-ares picked up from the OS directly over UDP — on some Windows
// networks that list is broken (e.g. an unreachable IPv6 entry) even though
// dns.lookup()/nslookup succeed via a different resolution path. Pointing
// c-ares at known-good public resolvers fixes the ECONNREFUSED on the SRV
// query without depending on the OS's (possibly misconfigured) DNS list.
// setDefaultResultOrder is irrelevant here — it only orders dns.lookup()
// results, not resolveSrv().
dns.setServers(["8.8.8.8", "1.1.1.1"]);

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
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("Please define MONGODB_URI in your environment variables");
    }

    cached.promise = mongoose.connect(MONGODB_URI).catch((err) => {
      cached.promise = null;   // don't cache a failed connection attempt — let the next call retry
      throw err;
    });
  }

  cached.conn = await cached.promise;   //Wait until the connection is complete.

  return cached.conn;
}

export default connectDB;