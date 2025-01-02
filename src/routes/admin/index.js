import eventRouter from "./event.route.js";
import express from "express";
const router = express.Router();

router.use("/", eventRouter);

router.get('/Page-create', (req, res) => {
    res.render('page-create');
});
export default router