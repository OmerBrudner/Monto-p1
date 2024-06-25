import { Db, MongoClient } from "mongodb";

const uri = 'mongodb+srv://omerb:Omerbrudner561995@cluster0.lvirkkp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// should be: const urii = process.env.MONGO_URI;

let db: Db;

export async function connect(): Promise<Db> {
    if (!db) {
      try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db('Brodi-Invoices-DB');
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Error while connecting to MongoDB', error);
      }
    }
    return db;
  }

