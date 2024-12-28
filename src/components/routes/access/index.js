'use strict'

// TODO: External modules
import express from 'express'
const router = express.Router();

// TODO: Internal modules
import accessController from '../../controllers/access.controller.js'
import forwardError from '../../../utils/forwardError.js'
import {authenticationV2} from '../../../middlewares/auth.js'
import eventController from '../../controllers/event.controller.js'


// GET
router.get('/login',accessController.getLogin)
router.get('/signup',accessController.getSignUp)
router.get('/admin', (req, res) => {
    res.render('adminPage-create');
  });
router.get('/event', eventController.createEvent);
// POST
// TODO: route sign up
router.post('/signup', forwardError(accessController.signUp));

// TODO: route login
router.post('/login', forwardError(accessController.login));

// TODO: route logout
// TODO: middleware authentication
router.post('/logout', authenticationV2, forwardError(accessController.logout));

// TODO: route refresh token
router.post('/refreshToken',authenticationV2,  forwardError(accessController.refreshToken));

export default router