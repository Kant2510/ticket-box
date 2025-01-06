import eventRouter from "./event.route.js";
import express from "express";
const router = express.Router();

router.use("/admin", eventRouter);

export default router