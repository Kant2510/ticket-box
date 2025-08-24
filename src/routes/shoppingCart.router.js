'use strict'
import express from 'express';
import shoppingCartController from "../controllers/shoppingCart.controller.js";
import {authenticationV2} from "../middlewares/auth.js";

const router = express.Router();

router.get('/my-cart', authenticationV2, shoppingCartController.getMyCart);
// Update shopping cart by customerId
router.put('/api/shopping-cart/:customerID', authenticationV2, shoppingCartController.updateShoppingCart);
router.post('/api/shopping-cart/delete', authenticationV2, shoppingCartController.deleteShoppingCart);

export default router;