import { MongoClient, ServerApiVersion } from "mongodb";
import users from "./usersData.js"; // Import users from usersDb.js

// DB uri
const uri = "mongodb://127.0.0.1:27017/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Get the "travelDestinations" database and "users" collection
    const myDB = client.db("travelDestinations");
    const myColl = myDB.collection("users");

    // Delete all existing documents in the "users" collection
    const deleteResult = await myColl.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing documents from the 'users' collection.`);

    // Insert multiple users into the "users" collection
    const result = await myColl.insertMany(users);
    console.log(`${result.insertedCount} documents were inserted with the following _ids:`, result.insertedIds);
  } catch (err) {
    console.error("Error inserting data: ", err);
  } finally {
    // Close the connection to the MongoDB server
    await client.close();
  }
}

// Run the setup function
run().catch(console.dir);
