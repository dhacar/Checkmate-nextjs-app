import { Collection, Db, MongoClient } from "mongodb";

let client: MongoClient | undefined;
let db: Db | undefined;

declare global {
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  if (!global.mongoClientPromise) {
    client = new MongoClient(mongoUri);
    global.mongoClientPromise = client.connect();
  }

  client = await global.mongoClientPromise;
  db = client.db("todo_app");

  return { client, db };
}

export async function getTodoCollection(): Promise<Collection> {
  if (!db) {
    const { db: database } = await connectToDatabase();
    return database.collection("todos");
  }

  return db.collection("todos");
}
