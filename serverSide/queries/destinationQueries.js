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
    const destination = await Destination.findOne({ _id: destinationId });
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

// Update a specific destination for a user
export async function updateDestination(email, destinationId, updatedData) {
  try {
    //user has to be logged in to update a destination - will have to change this later for authentication
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    // Update the destination document
    const updatedDestination = await Destination.findByIdAndUpdate(
      destinationId,
      updatedData,
      { new: true } // This returns the updated document based on mongoose docs
    );
    if (!updatedDestination) {
      throw new Error("Destination not found and couldn't be updated");
    }
    return updatedDestination;
  } catch (error) {
    console.error("Failed to update destination:", error);
    throw new Error("Failed to update destination. Make sure the user is logged in before attempting to update a destination");
  }
}

// Delete a specific destination for a user identified by email and destination ID
export async function deleteDestination(email, destinationId) {
  try {
    //user has to be logged in to delete a destination - will have to change this later for authentication
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    //delete the destination
    const destinationToDelete = await Destination.findByIdAndDelete(destinationId);
    if (!destinationToDelete) {
      throw new Error("Destination not found and couldn't be deleted");
    }
    return console.log(`Destination successfully deleted by ${user}`);
  } catch (error) {
    console.error("Failed to delete destination:", error);
    throw new Error("Failed to delete destination. Make sure the user is logged in before attempting to delete a destination");
  }
}
