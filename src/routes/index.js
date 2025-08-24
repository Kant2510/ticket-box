'use strict'

// TODO: External Modules
import getHomepage from '../controllers/home.controller.js'
import accessRoutes from './access/index.js'
import eventRoutes from './event.router.js'
import orderRoutes from './order.router.js'
import getAbout from '../controllers/about.controller.js'
import getContact from '../controllers/contact.controller.js'
import getProduct from '../controllers/product.controller.js'
import shoppingCartRoutes from './shoppingCart.router.js'
import getMyOrder from '../controllers/my_order.controller.js'
import express from 'express'
import profileRoutes from './profile/index.js'
import adminRouter from './admin/index.js'  //Tạo event và ticket

const router = express.Router()
// TODO: Main Route

// accessRoutes
router.use(accessRoutes)
// profile
router.use(profileRoutes)
// eventRoutes
router.use(eventRoutes)
// ShoppingCartAPIRoutes
router.use(shoppingCartRoutes)
//Trang voucher của admin
router.use(adminRouter)
// orderRoutes
router.use(orderRoutes)

router.get('/', getHomepage)
router.get('/about', getAbout)
router.get('/contact', getContact)
router.get('/product', getProduct)
router.get('/my-order', getMyOrder);

export default router
