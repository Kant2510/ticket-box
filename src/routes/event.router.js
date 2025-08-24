'use strict'
import express from 'express'
import EventController from '../controllers/event.controller.js'
import EventDetailController from '../controllers/detail.controller.js'
import forwardError from '../utils/forwardError.js'

const router = express.Router()
// GET
router.get('/events/:id', EventDetailController.getEventDetail);
router.get('/events/:id/booking', EventDetailController.getBooking);
// POST
router.post('/eventAdmin', forwardError(EventController.getEventByCategory))

export default router
