import ProfileController from "../../controllers/profile.controller.js";
import express from 'express'
import {authenticationV2} from "../../middlewares/auth.js";
const router = express.Router();

router.get('/profile', authenticationV2, ProfileController.getProfile)
router.post('/profile', authenticationV2, (ProfileController.uploadAvatar), (ProfileController.updateProfile));
export default router