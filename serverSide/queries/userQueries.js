import mongoose from "../db/connect.js";
import User from "../schemas/userSchema.js";

// Helper function to remove password from users before return
function removePassword(user) {
  if (!user) return null;
  const userData = user.toObject();
  delete userData.hashedPassword; // Remove password
  return userData;
}

// GET

// Get all users
export async function getUsers() {
  try {
    const users = await User.find();
    return users.map(removePassword);
  } catch (error) {
    console.error("Failed to get users:", error);
    throw new Error("Failed to get users");
  }
}

// Get a user by id
export async function getUserById(id) {
  try {
    const user = await User.findById(id);
    return removePassword(user);
  } catch (error) {
    console.error("Failed to get user by id:", error);
    throw new Error("Failed to get user by id");
  }
}

// Get a user by email
export async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    return removePassword(user);
  } catch (error) {
    console.error("Failed to get user by email:", error);
    throw new Error("Failed to get user by email");
  }
}

// Authenticate user, gives back user object on success or null on fail
export async function authenticateUser(credentials) {
  const { email, password } = credentials;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email address or password");
    }

    // Check if the password matches (basic comparison for now)
    if (user.hashedPassword !== password) {
      throw new Error("Invalid email address or password");
    }

    // If authenticated, set isLoggedIn true
    user.isLoggedIn = true;
    await user.save();

    return removePassword(user);
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    throw error;
  }
}

// Create a new user
export async function createUser(user) {
  try {
    // Check if the username already exists
    const existingUserName = await User.findOne({ userName: user.userName });
    if (existingUserName) {
      throw new Error("Username already in use.");
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email: user.email });
    if (existingEmail) {
      throw new Error("Email already in use.");
    }

    // If not in use, create and return user
    const newUser = new User(user);
    await newUser.save();

    return removePassword(newUser);
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
}

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
