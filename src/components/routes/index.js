'use strict'

// TODO: External Modules
import getHomepage from "../controllers/home.controller.js";
import EventController from '../controllers/event.controller.js';
import express from 'express'
const router = express.Router();

// TODO: Main Route
import accessRoutes from './access/index.js';
import getAbout from '../controllers/about.controller.js';
import getContact from '../controllers/contact.controller.js';
import getProduct from '../controllers/product.controller.js';
import getDetail from '../controllers/detail.controller.js';
router.get('/event', EventController.createEvent);
router.post('/event', EventController.handleCreateEvent);
router.get('/', getHomepage)
router.get('/about', getAbout)
router.get('/contact', getContact)
router.get('/product', getProduct)
router.get('/detail', getDetail)
router.use('/', accessRoutes);

export default router