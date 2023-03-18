import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

export async function connect(callback) {
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB.');
    return callback();
  } catch(error) {
    return callback(err);
  }
}

export function db() {
  return client.db("parking_shopping_db");
}
