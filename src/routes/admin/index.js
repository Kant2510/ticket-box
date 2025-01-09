import express from 'express';
import voucherRouter from './voucher.route.js';
import eventRouter from './event.route.js';
import eventListRouter from './eventList.route.js';
import policyRouter from './policy.route.js';

const router = express.Router();

// Admin routes
router.use('/adminPage-list', eventListRouter);  // Sửa lại route này
router.use('/admin', eventRouter);
router.use('/admin-policy', policyRouter);

// Voucher routes
router.use('/admin-voucher', voucherRouter);   
router.get('/admin-voucher', (req, res) => {
    res.render('admin-voucher');
});

export default router;