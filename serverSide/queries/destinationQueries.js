import mongoose from "../db/connect.js";
import Destination from "../schemas/destinationsSchema.js";
import { getUserByEmail } from "./userQueries.js";

// Get all destinations
export async function getDestinations() {
  try {
    const destinations = await Destination.find();
    return destinations;
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    throw new Error("Failed to fetch destinations");
  }
}

// Get all destinations for a specific user by user email
export async function getDestinationsByUserId(email) {
  try {
    if (!email) {
      throw new Error("User email is required");
    }
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const destinations = await Destination.find({ userId: user._id });
    return destinations;
  } catch (error) {
    console.error("Failed to get destinations for the user:", error);
    throw new Error("Failed to get destinations for the user");
  }
}

// Get specific destination by destination id
export async function getDestinationByDestinationId(destinationId) {
  try {
    if (!destinationId) {
      throw new Error("Destination ID is required");
    }

    // Use findById to fetch by _id
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      throw new Error("Destination not found");
    }

    return destination;
  } catch (error) {
    console.error("Failed to fetch destination:", error);
    throw new Error("Failed to fetch destination");
  }
}

// Create a new destination for a specific user
export async function createDestination(email, destination) {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const newDestination = new Destination({ userId: user._id, ...destination });
    return newDestination.save();
  } catch (error) {
    console.error("Error creating destination:", error);
    throw new Error("Failed to create destination");
  }
}

// Update a specific destination for by id
export async function updateDestination(email, destinationId, updatedData) {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    console.log("Received Updated Data:", updatedData);

    // Update the destination document in MongoDB
    const updatedDestination = await Destination.findByIdAndUpdate(
      destinationId,
      updatedData,
      { new: true, useFindAndModify: false } // Return the updated document
    );
    
    if (!updatedDestination) {
      throw new Error("Destination not found and couldn't be updated");
    } else {
      console.log("Updated Data:", updatedDestination);
    }
    
    return updatedDestination;
  } catch (error) {
    console.error("Failed to update destination:", error);
    throw new Error("Failed to update destination. Make sure the user is logged in before attempting to update a destination");
  }
}



// Delete a specific destination by user email and destination ID
export async function deleteDestination(email, destinationId) {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Try to delete the destination by ID
    const destinationToDelete = await Destination.findByIdAndDelete(destinationId);
    if (!destinationToDelete) {
      throw new Error("Destination not found");
    }

    // Return the deleted document
    return destinationToDelete;

  } catch (error) {
    console.error("Error in deleteDestination:", error.message);
    throw error; // Pass the original error message up the call stack
  }
}
