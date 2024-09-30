import express from "express";
const usersRouter = express.Router();

import { getUsers, getUserById, getUserByEmail, toggleUserLoggedInStatus, authenticateUser, createUser } from "../queries/userQueries.js";

// GET all users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET user by ID
usersRouter.get("/id/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// GET user by email
usersRouter.get("/email/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await getUserByEmail(email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found", isLoggedIn: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user", isLoggedIn: false });
  }
});

// POST new user
usersRouter.post("/", async (req, res) => {
  try {
    const newUser = req.body;
    console.log("Creating user with data:", newUser);
    const userId = await createUser(newUser);
    res.status(201).json({ ...newUser, id: userId });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Toggle the loggedIn status of a user by email
usersRouter.patch("/:email/toggle_status", async (req, res) => {
  try {
    const email = req.params.email;
    const result = await toggleUserLoggedInStatus(email);

    res.json({
      message: `User ${result.email} loggedIn status changed to ${result.isLoggedIn}`,
    });
  } catch (error) {
    console.error("Error in toggling user login status:", error);
    res.status(500).json({ error: "Failed to toggle user loggedIn status" });
  }
});

// Very basic user authentication returns user without destinations on success
usersRouter.post("/authentication", async (req, res) => {
  const credentials = req.body;

  try {
    const user = await authenticateUser(credentials);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" }); // Unauthorized if authentication fails
    }

    res.status(200).json({ user }); // Respond with user object (without destinations)
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    res.status(500).json({ error: "Failed to authenticate user" });
  }
});

export default usersRouter;
