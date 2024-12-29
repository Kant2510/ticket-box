'use strict'

// External Modules
import express from 'express';
import getHomepage from "../controllers/home.controller.js";
import EventController from '../controllers/event.controller.js';
import getAbout from '../controllers/about.controller.js';
import getContact from '../controllers/contact.controller.js';
import getProduct from '../controllers/product.controller.js';
import getDetail from '../controllers/detail.controller.js';
import accessRoutes from './access/index.js';
import AccessService from '../../services/access.service.js';

const router = express.Router();

// Event routes
router.get('/adminPage-create', (req, res) => res.render('adminPage-create'));
router.get('/event/create', EventController.createEvent);
router.post('/event', EventController.handleCreateEvent);
router.post('/event/:eventId/ticket', EventController.addTicketType);
router.patch('/event/:eventId', EventController.updateEvent);

// Main routes
router.get('/', getHomepage);
router.get('/about', getAbout);
router.get('/contact', getContact);
router.get('/product', getProduct);
router.get('/detail', getDetail);

// Access routes
router.use('/', accessRoutes);

// Route to handle verification code submission
router.post('/verify', async (req, res) => {
    const { code } = req.body;
    // You may need to store the verification code in session or database to validate it
    // For now, let's assume you have a way to access the generated verification code
    if (code === verificationCode.toString()) {
        // Code is valid, proceed with registration, e.g., save user to database
        res.status(200).send('Verification successful');
    } else {
        // Code is invalid
        res.status(400).send('Invalid verification code');
    }
});

export default router;