'use strict'

// TODO: External Modules
import getHomepage from '../controllers/home.controller.js'
import accessRoutes from './access/index.js'
import eventRoutes from './event.router.js'
import getAbout from '../controllers/about.controller.js'
import getContact from '../controllers/contact.controller.js'
import getProduct from '../controllers/product.controller.js'
import eventDetailController from '../controllers/detail.controller.js'
import express from 'express'
import profileRoutes from './profile/index.js'
const router = express.Router()
import {ensureAuthen} from "../middlewares/auth.js";

import adminRouter  from './admin/index.js'
// TODO: Main Route

router.get('/', getHomepage)
router.get('/about', getAbout)
router.get('/contact', getContact)
router.get('/product', getProduct)
router.get('/detail', eventDetailController.getEventDetail)

// accessRoutes
router.use(accessRoutes)

// eventRoutes
router.use(eventRoutes)

// profile
router.use(profileRoutes)

router.use('/admin', adminRouter)


export default router
