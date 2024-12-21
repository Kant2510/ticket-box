const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller.js'); // import the controller

// POST route to create a new event
router.post('/', eventController.createEvent);

// PATCH route to update an existing event
router.patch('/:eventId', eventController.updateEvent);

// GET route to get all events
router.get('/', eventController.getAllEvents);

// GET route to get a single event by ID
router.get('/:eventId', eventController.getEventById);

// DELETE route to delete an event
router.delete('/:eventId', eventController.deleteEvent);

module.exports = router;
