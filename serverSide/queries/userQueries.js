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
    }
  }
  return client.db(dbName);
}

// Close the MongoDB connection
async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    console.log("Disconnected from MongoDB");
  }
}

// GET

// Get all users
export async function getUsers() {
  try {
    const db = await connect();
    const users = await db.collection("users").find({}).toArray();
    return users;
  } catch (error) {
    console.error("Failed to get users:", error);
    throw new Error("Failed to get users");
  } finally {
    await closeConnection();
  }
}

// Get a user by id
export async function getUserById(id) {
    try {
        const db = await connect();

        // Convert string id to ObjectId (MongoDb uses ObjectId type)
        const objectId = new ObjectId(id);
        console.log('Id= ' + id);
        console.log('ObjectId= ' + objectId);
        // Query specific user by objectId
        const user = await db.collection('users').findOne({ _id: objectId });
      
        return user;
    } catch (error) {
        console.error("Failed to get user by id:", error);
        throw new Error("Failed to get user by id");
    } finally {
        await closeConnection();
    };
};

// Get a user by email
export async function getUserByEmail(email) {
  try {
    const db = await connect();
    const user = await db.collection("users").findOne({ email });
    return user;
  } catch (error) {
    console.error("Failed to get user by email:", error);
    throw new Error("Failed to get user by email");
  } finally {
    await closeConnection();
  }
}

// Authentica user, gives back user object on success or null on fail
export async function authenticateUser(credentials) {
  const { email, password } = credentials;


  try {
    const db = await connect();
    const user = await db.collection("users").findOne(
      { email },
      { projection: { destinations: 0 } } // Exclude the destinations
    );
    console.log("Found email");
    if (!user) {
      return null;
    };

    // Compare the "hashed" password
    if (user.hashedPassword !== password) {
      return null;
    };

    return user; // Return user if authentication is successful
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    throw new Error("Failed to authenticate user");
  }
};

// Create a new user
export async function createUser(user) {
  const db = await connect();
  try {
    const result = await db.collection("users").insertOne(user);
    if (result.acknowledged) {
      return result.insertedId;
    } else {
      throw new Error("Failed to insert user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  } finally {
    await closeConnection();
  }
}

// Update a user by email - Work in Progress
export async function updateUserByEmail(email, updates) {
  const db = await connect();
  const result = await db.collection("users").updateOne({ email }, { $set: updates });
  return result.modifiedCount;
}

// Toggle the loggedIn status of a user by email
export async function toggleUserLoggedInStatus(email) {
  try {
    const db = await connect();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    // Toggle the isLoggedIn status true/false
    const newStatus = !user.isLoggedIn;

    // Update the user with the new status
    const result = await db.collection("users").updateOne({ email }, { $set: { isLoggedIn: newStatus } });

    if (result.modifiedCount > 0) {
      console.log(`User ${email} loggedIn status changed to ${newStatus}`);
      return { email, isLoggedIn: newStatus };
    } else {
      throw new Error("Failed to update user status");
    }
  } catch (error) {
    console.error("Error toggling user loggedIn status:", error);
    throw error;
  } finally {
    await closeConnection();
  }
}

// Delete a user by email - Work in progress
export async function deleteUserByEmail(email) {
  const db = await connect();
  const result = await db.collection("users").deleteOne({ email });
  return result.deletedCount;
}

// // Create indexes for email in user collection
// async function createIndexes() {
//     const db = await connect();
//     const usersCollection = db.collection('users');

//     try {
//       await usersCollection.createIndex({ email: 1 }, { unique: true });
//       console.log('Unique index created on the email field');
//     } catch (error) {
//       console.error('Failed to create indexes:', error);
//       throw error;
//     } finally {
//       await closeConnection();
//     }
//   }

//   // Create indexes at the start of your application
//   (async () => {
//     await createIndexes();
//   })();
