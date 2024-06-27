import { Db, MongoClient } from "mongodb";

let db: Db;

// Load the environment variables
const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASS;
const cluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DB;

// Init uri
const uri = `mongodb+srv://${user}:${password}@${cluster}.lvirkkp.mongodb.net/`;
console.log(uri);

export async function connect(): Promise<Db> {
  if (!db) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      db = client.db(dbName);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error while connecting to MongoDB', error);
    }
  }
  return db;
}


