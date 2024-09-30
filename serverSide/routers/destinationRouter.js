import express from 'express';
const destinationsRouter = express.Router();

import {
    getDestinations,
    getDestinationsByUserId,
    getDestinationByEmailAndId,
    createDestination,
    updateDestination,
    deleteDestination
  } from '../queries/destinationQueries.js';

// GET all destinations
destinationsRouter.get('/', async (req, res) => {
  try {
    const destinations = await getDestinations();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// GET destinations by user email
destinationsRouter.get('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const destinations = await getDestinationsByUserId(email);
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations for user' });
  }
});

// GET a specific destination by user email and destination ID
destinationsRouter.get('/:id/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const destinationId = req.params.id;

    const destination = await getDestinationByEmailAndId(email, destinationId);

    if (destination) {
      res.json(destination); // Return the destination if found
    } else {
      res.status(404).json({ error: 'Destination not found' });
    }
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// POST new destination
destinationsRouter.post('/users/:email/', async (req, res) => {
  try {
    const email = req.params.email;
    const destination = req.body;

    const newDestination = await createDestination(email, destination);

    if (newDestination) {
      res.status(201).json(newDestination); // Return the new destination object
    } else {
      res.status(404).json({ error: 'User not found or destination could not be added' });
    }
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

// Update destination by id and email
destinationsRouter.put('/:id/users/:email', async (req, res) => {
  try {
    const destinationId = req.params.id;
    const userEmail = req.params.email;
    const updatedData = req.body;

    const updatedDestination = await updateDestination(userEmail, destinationId, updatedData);

    if (updatedDestination) {
      res.json({ message: 'Destination updated successfully' });
    } else {
      res.status(404).json({ error: 'Destination not found or no changes made' });
    }
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ error: 'Failed to update destination' });
  }
});

// DELETE destination
destinationsRouter.delete('/:id/users/:email', async (req, res) => {
  try {
    const destinationId = req.params.id;
    const userEmail = req.params.email;
    const deleted = await deleteDestination(userEmail, destinationId);
    if (deleted) {
      res.json({ message: 'Destination deleted successfully' });
    } else {
      res.status(404).json({ error: 'Destination not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete destination' });
  }
});

export default destinationsRouter;
