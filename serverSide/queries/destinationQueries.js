import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const uri = "mongodb://127.0.0.1:27017/";
const dbName = "travelDestinations";

let client;

// Connect to MongoDB
async function connect() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    try {
      await client.connect();
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      throw error;
    };
  };
  return client.db(dbName);
};

// Close the MongoDB connection
async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    console.log('Disconnected from MongoDB');
  };
};

// Helper function to get the users collection to use for destinations
async function getUsersCollection() {
  const db = await connect();
  return db.collection('users');
};

// Get all destinations from all users
export async function getDestinations() {
  let usersCollection;
  try {
    usersCollection = await getUsersCollection();
    const users = await usersCollection.find({}, { projection: { destinations: 1 } }).toArray();
    const allDestinations = users.flatMap(user => user.destinations || []); // Flatten the destinations into single array
    return allDestinations;
  } catch (error) {
    console.error('Failed to fetch destinations:', error);
    throw new Error('Failed to fetch destinations');
  } finally {
    await closeConnection(); // Close conenction at the end
  };
};

// Get all destinations for a specific user
export async function getDestinationsByUserId(email) {
  let usersCollection;
  try {
    usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne(
      { email: email },
      { projection: { destinations: 1 } } // Get only the destinations array
    );
    return user.destinations || []; // Return destinations or an empty array
  } catch (error) {
    console.error('Failed to fetch destinations by user ID:', error);
    throw new Error('Failed to fetch destinations by user ID');
  } finally {
    await closeConnection();
  };
};

// Get specific destination by user email and destination id
export async function getDestinationByEmailAndId(userEmail, destinationId) {
  try {
    const usersCollection = await getUsersCollection();

    // Convert destinationId to ObjectId
    const objectId = new ObjectId(destinationId);
    console.log("In query: " + destinationId);

    const user = await usersCollection.findOne(
      {
        email: userEmail,
        destinations: { $elemMatch: { _id: objectId } } // Find destination by _id within the destinations array
      },
      {
        projection: { "destinations.$": 1 }, // Get only the matched destination
      }
    );

    // Return the matched destination if it exists
    return user ? user.destinations[0] : null;
  } catch (error) {
    console.error("Failed to fetch destination:", error);
    throw new Error("Failed to fetch destination");
  } finally {
    await closeConnection();
  }
}

// Create a new destination for a specific user
export async function createDestination(email, destination) {
  try {
    const usersCollection = await getUsersCollection();

    // Create a new destination ObjectId
    const newDestination = { _id: new ObjectId(), ...destination };

    // Insert destination into user that matches email
    const result = await usersCollection.insertOne(
      { email: email },
      { $push: { destinations: newDestination } }
    );

    // Check if the destination was added successfully
    if (result.modifiedCount > 0) {
      console.log(`Destination added successfully for user: ${email}`);
      return newDestination;
    } else {
      console.log(`No user found with email: ${email}`);
      return null;
    }
  } catch (error) {
    console.error("Failed to create destination:", error);
    throw new Error("Failed to create destination");
  } finally {
    await closeConnection();
  };
};

// Update a specific destination for a user
export async function updateDestination(userEmail, destinationId, updatedData) {
  try {
    const usersCollection = await getUsersCollection();
    const result = await usersCollection.updateOne(
      {
        email: userEmail,
        'destinations._id': new ObjectId(destinationId)
      },
      {
        $set: {
          "destinations.$.title": updatedData.title,
          "destinations.$.description": updatedData.description,
          "destinations.$.image": updatedData.image,
          "destinations.$.link": updatedData.link,
          "destinations.$.tag": updatedData.tag,
        },
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Failed to update destination:", error);
    throw new Error("Failed to update destination");
  } finally {
    await closeConnection();
  }
}

// Delete a specific destination for a user identified by email and destination ID
export async function deleteDestination(userEmail, destinationId) {
  try {
    const usersCollection = await getUsersCollection();
    const objectId = new ObjectId(destinationId);

    // Remove destination from array where id match using $pull
    const result = await usersCollection.updateOne(
      {
        email: userEmail,
      },
      {
        $pull: { destinations: { _id: objectId } },
      }
    );

    if (result.modifiedCount === 0) {
      console.log("No document matched the given userEmail and destinationId, or no changes were made.");
    } else {
      console.log("Destination deleted successfully.");
    }

    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Failed to delete destination:", error);
    throw new Error("Failed to delete destination");
  } finally {
    await closeConnection();
  }
}
