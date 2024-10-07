import express from "express";
const destinationsRouter = express.Router();

import { getDestinations, getDestinationsByUserId, createDestination, updateDestination, deleteDestination } from "../queries/destinationQueries.js";

// GET all destinations
destinationsRouter.get("/", async (req, res) => {
  try {
    const destinations = await getDestinations();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

// GET a destination by destinationId
destinationsRouter.get("/:id", async (req, res) => {
  try {
    const destinationId = req.params.id;
    const destination = await getDestinationByDestinationId(destinationId);
    if (destination) {
      res.json(destination);
    } else {
      res.status(404).json({ error: "Destination not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch destination" });
  }
});

// GET destinations by user email
destinationsRouter.get("/users/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const destinations = await getDestinationsByUserId(email);
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch destinations for user" });
  }
});

// POST new destination
destinationsRouter.post("/", async (req, res) => {
  try {
    const destination = req.body.destination;
    const userEmail = req.body.userEmail;
    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized: User not logged in!" });
    }
    const newDestination = await createDestination(userEmail, destination);

    if (newDestination) {
      res.status(201).json(newDestination); // Return the new destination object
    } else {
      res.status(404).json({ error: "User not found or destination could not be added" });
    }
  } catch (error) {
    console.error("Error creating destination:", error);
    res.status(500).json({ error: "Failed to create destination" });
  }
});

// Update destination by id and email
destinationsRouter.put("/:id", async (req, res) => {
  try {
    const destinationId = req.params.id;
    const userEmail = req.body.email;
    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }
    const updatedData = req.body.destination;

    const updatedDestination = await updateDestination(userEmail, destinationId, updatedData);

    if (updatedDestination) {
      res.status(200).json(updatedDestination);
    } else {
      res.status(404).json({ error: "Destination not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).json({ error: "Failed to update destination" });
  }
});

// DELETE destination
destinationsRouter.delete("/:id", async (req, res) => {
  try {
    const destinationId = req.params.id;
    const userEmail = req.body.email;
    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }
    const deleted = await deleteDestination(userEmail, destinationId);
    if (deleted) {
      res.json({ message: "Destination deleted successfully" });
    } else {
      res.status(404).json({ error: "Destination not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete destination" });
  }
});

export default destinationsRouter;
