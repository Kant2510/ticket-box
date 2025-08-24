'use strict'
import express from 'express';
import EventDetailController from '../controllers/detail.controller.js'

const router = express.Router();
router.get('/events/:id', EventDetailController.getEventDetail);
router.get('/events/:id/booking', EventDetailController.getBooking);

export default router;