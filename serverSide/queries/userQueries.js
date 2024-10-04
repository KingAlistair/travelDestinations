import mongoose from '../db/connect.js'
import User from "../schemas/userSchema.js";


// GET

// Get all users
export async function getUsers() {
  try {
    return await User.find();
  } catch (error) {
    console.error("Failed to get users:", error);
    throw new Error("Failed to get users");
  }
}

// // Get a user by id
export async function getUserById(id) {
  try {

    return User.findById(id);
  } catch (error) {
    console.error("Failed to get user by id:", error);
    throw new Error("Failed to get user by id");
  }
}

// // Get a user by email
export async function getUserByEmail(email) {
  try {
    return User.findOne({ email });
  } catch (error) {
    console.error("Failed to get user by email:", error);
    throw new Error("Failed to get user by email");
  }
}

// Authentica user, gives back user object on success or null on fail
export async function authenticateUser(credentials) {
  const { email, password } = credentials;

  try {
    const user = await User.findOne(
      { email })

    if (!user) {
      return null;
    }

    // Compare the "hashed" password
    if (user.hashedPassword !== password) {
      return null;
    }

    return user; // Return user if authentication is successful
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    throw new Error("Failed to authenticate user");
  }
}

// Create a new user
export async function createUser(user) {
  try {
    const newUser = new User(user);
    return newUser.save();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update a user by email - Work in Progress
export async function updateUserByEmail(email, updates) {
  try {
    return User.findOneAndUpdate(email, updates);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Change loggedIn status of a user by email, returns user
export async function changeUserLoggedInStatus(email, status) {
  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  // Set the new status (true or false)
  user.isLoggedIn = status;

  // Save the updated user status
  const updatedUser = await user.save();

  return updatedUser;
};

// // Delete a user by email - Work in progress
// export async function deleteUserByEmail(email) {
//   const db = await connect();
//   const result = await db.collection("users").deleteOne({ email });
//   return result.deletedCount;
// }

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
