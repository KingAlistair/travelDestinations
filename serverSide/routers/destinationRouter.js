import express from "express";
import multer from "multer";
import passport from "../auth/passportConfig.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

import { getDestinations, getDestinationsByUserId, getDestinationByDestinationId, createDestination, updateDestination, deleteDestination } from "../queries/destinationQueries.js";

const destinationsRouter = express.Router();

const imageFolderPath = "clientSide/destinationImages/"

// Configure multer storage - use ut as middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageFolderPath); // specify destination folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`; // generate unique file name
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });


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


// POST new destination save image into destinationImages folder
destinationsRouter.post("/", passport.authenticate('jwt', { session: false }),  upload.single('image'), async (req, res) => {
  try {
    const { title, description, link, countryCode } = req.body;
    const userEmail = req.body.userEmail;

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    // Check if a file was uploaded and generate a filename for it
    let imageFilename = null;
    if (req.file) {
      imageFilename = req.file.filename; // Use the generated filename
    }

    // Create the destination object to save in the database
    const destination = {
      title,
      description,
      image: imageFilename,
      link,
      countryCode
    };

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
destinationsRouter.put("/:id", passport.authenticate('jwt', { session: false }), upload.single("image"), async (req, res) => {
  try {
    const destinationId = req.params.id;
    const userEmail = req.body.userEmail;

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    // Retrieve current destination to keep the existing image if none is uploaded
    const existingDestination = await getDestinationByDestinationId(destinationId);

    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
      countryCode: req.body.countryCode,
      image: req.file ? req.file.filename : existingDestination.image, // Use new file or existing image
    };

    const updatedDestination = await updateDestination(userEmail, destinationId, updatedData);

    if (updatedDestination) {
      return res.status(200).json(updatedDestination);
    } else {
      return res.status(404).json({ error: "Destination not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating destination:", error);
    return res.status(500).json({ error: "Failed to update destination" });
  }
});

// DELETE destination
destinationsRouter.delete("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const destinationId = req.params.id;
    const userEmail = req.body.email;

    // validate user email
    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }

    // Retrieve the destination to get the image filename
    const destination = await getDestinationByDestinationId(destinationId);
    console.log(destination)
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    if (destination.image) {
      const deleteImagePath = path.join(imageFolderPath, destination.image);

      fs.unlink(deleteImagePath, (error) => {
        if (error) {
          console.error("Failed to delete image file:", error);
          // Here, we log the error but do not prevent the destination deletion
        } else {
          console.log("Image file deleted successfully");
        }
      });
    } else {
      console.log("No image file associated with this destination");
    }

    const deleted = await deleteDestination(userEmail, destinationId);

    if (deleted) {
      res.json({ message: "Destination deleted successfully" });
    }
  } catch (error) {
    // Check for specific error messages to determine the response
    if (error.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    } else if (error.message === "Destination not found") {
      return res.status(404).json({ error: "Destination not found" });
    } else {
      console.error("Unexpected error:", error);
       res.status(500).json({ error: "Failed to delete destination" });
    }
  }
});


export default destinationsRouter;
