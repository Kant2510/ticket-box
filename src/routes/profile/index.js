import ProfileController from "../../controllers/profile.controller.js";
import express from 'express'
const router = express.Router();
import {authenticationV2, ensureAuthen} from "../../middlewares/auth.js";
import forwardError from "../../utils/forwardError.js";

router.get('/profile' , authenticationV2, forwardError(ProfileController.getProfile))
router.post('/profile', authenticationV2, forwardError(ProfileController.uploadAvatar), forwardError(ProfileController.updateProfile));
export default router