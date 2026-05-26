import { MongoClient, type Db } from "mongodb"

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable")
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }

  return global._mongoClientPromise
}

export async function getDb(): Promise<Db> {
  const connectedClient = await getClientPromise()
  return connectedClient.db(process.env.MONGODB_DB || "fooddelivery")
}
