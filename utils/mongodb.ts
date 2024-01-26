// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri: string = process.env.MONGODB_URI
let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  
  let globalWithMongoClientPromise = global as typeof globalThis & {
    mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongoClientPromise.mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongoClientPromise.mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongoClientPromise.mongoClientPromise;
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise