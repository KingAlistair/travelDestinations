import express from "express";
const usersRouter = express.Router();
import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportConfig from '../passport.js';
passportConfig(passport);

import { getUsers, getUserById, getUserByEmail, changeUserLoggedInStatus, authenticateUser, createUser } from "../queries/userQueries.js";

// Middleware to authenticate using Passport JWT
usersRouter.use(passport.initialize()); 


// GET all users
//An example of using passport.authenticate('jwt', { session: false }) on a route that should only be accessible with a valid token.
usersRouter.get("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// // GET user by email
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

// POST new user - Register
usersRouter.post("/", async (req, res) => {
  try {
    const newUser = req.body;
    console.log("Creating user with data:", newUser);

    const user = await createUser(newUser); // Create user

    // Send back user information on success.
    return res.status(201).json(user);

  } catch (error) {
    console.error("Error creating user:", error);

    // If the error is validation-related, send a 400 status with the error message
    if (error.message === 'Username already in use.' || error.message === 'Email already in use.') {
      return res.status(400).send({ error: error.message });
    } else {
      // For all other errors, return a generic 500 error message
      return res.status(500).send('Failed to create user.');
    }
  }
});


// Change loggedIn status of a user by email, returns user
usersRouter.patch("/:email/session/:status", async (req, res) => {
  try {
    const email = req.params.email;
    const status = req.params.status.toLowerCase() === 'true'; // Convert 'true' or 'false' string to boolean

    const user = await changeUserLoggedInStatus(email, status);

    res.json(user);
  } catch (error) {
    console.error("Error in changing user login status:", error);
    res.status(500).json({ error: "Failed to toggle user loggedIn status" });
  }
});

// POST /authentication - Log in a user and return a JWT token
usersRouter.post("/authentication", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Call the authenticateUser function to validate the user and generate the token
    const { user, token } = await authenticateUser({ email, password });

    // Send back the user data (excluding the password) and the JWT token
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.message === "Invalid email address or password") {
      return res.status(401).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Failed to authenticate user" });
    }
  }
});

export default usersRouter;
