'use strict'

// TODO: External Modules
import getHomepage from '../controllers/home.controller.js'
import authRoutes from './auth.router.js'
import eventRoutes from './event.router.js'
import getAbout from '../controllers/about.controller.js'
import getContact from '../controllers/contact.controller.js'
import getProduct from '../controllers/product.controller.js'
import eventDetailController from '../controllers/detail.controller.js'
import express from 'express'

const router = express.Router()

// TODO: Main Route

router.get('/', getHomepage)
router.get('/about', getAbout)
router.get('/contact', getContact)
router.get('/product', getProduct)
router.get('/detail', eventDetailController.getEventDetail)

// accessRoutes
router.use('/', authRoutes)

// eventRoutes
router.use('/', eventRoutes)

export default router
