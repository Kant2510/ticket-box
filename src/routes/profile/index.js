import ProfileController from "../../controllers/profile.controller.js";
import express from 'express'
const router = express.Router();
import {authenticationV2, ensureAuthen} from "../../middlewares/auth.js";
router.get('/profile' ,ensureAuthen,  authenticationV2, ProfileController.getProfile)
router.post('/profile', ensureAuthen, authenticationV2, ProfileController.uploadAvatar, ProfileController.updateProfile);

export default router