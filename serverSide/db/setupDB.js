import { MongoClient, ServerApiVersion } from "mongodb";
import users from "./usersData.js"; // Import users
import destinations from "./destinationsData.js"; // Import destinations

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

    // Get the "travelDestinations" database and both "users" and "destinations" collections
    const myDB = client.db("travelDestinations");
    const usersCollection = myDB.collection("users");
    const destinationsCollection = myDB.collection("destinations");

    // Step 1: Delete all existing documents in both "users" and "destinations" collections
    const deleteUsersResult = await usersCollection.deleteMany({});
    const deleteDestinationsResult = await destinationsCollection.deleteMany({});
    console.log(`Deleted ${deleteUsersResult.deletedCount} existing users from the 'users' collection.`);
    console.log(`Deleted ${deleteDestinationsResult.deletedCount} existing destinations from the 'destinations' collection.`);

    // Step 2: Insert multiple users into the "users" collection
    const usersInsertResult = await usersCollection.insertMany(users);
    console.log(`${usersInsertResult.insertedCount} users were inserted with the following _ids:`, usersInsertResult.insertedIds);

    // Step 3: Insert multiple destinations into the "destinations" collection
    const destinationsInsertResult = await destinationsCollection.insertMany(destinations);
    console.log(`${destinationsInsertResult.insertedCount} destinations were inserted with the following _ids:`, destinationsInsertResult.insertedIds);

  } catch (err) {
    console.error("Error inserting data: ", err);
  } finally {
    // Close the connection to the MongoDB server
    await client.close();
  }
}

// Run the setup function
run().catch(console.dir);
