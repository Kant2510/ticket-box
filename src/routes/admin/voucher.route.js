import express from 'express';
import Voucher from '../../models/voucher.model.js';
const router = express.Router();

// Route để lấy danh sách voucher qua API
router.get('/vouchers', async (req, res) => {
    try {
        const vouchers = await Voucher.find({}).sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            vouchers: vouchers 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching vouchers: ' + err.message 
        });
    }
});

// Route filter theo status
router.get('/status/:status', async (req, res) => {
    try {
        const status = req.params.status;
        const currentDate = new Date();
        
        let query = {};
        if (status === 'active') {
            query.endDate = { $gte: currentDate };
        } else if (status === 'expired') {
            query.endDate = { $lt: currentDate };
        }

        const vouchers = await Voucher.find(query).sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            vouchers: vouchers 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching vouchers by status: ' + err.message 
        });
    }
});

// Route search
router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.name || '';
        const vouchers = await Voucher.find({
            voucherName: { $regex: searchTerm, $options: 'i' }
        }).sort({ createdAt: -1 });
        
        res.json({ 
            success: true, 
            vouchers: vouchers 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Error searching vouchers: ' + err.message 
        });
    }
});

// Route thêm voucher
router.post('/add', async (req, res) => {
    try {
        const { voucherName, discountValue, maxDiscount, startDate, endDate, quantity } = req.body;

        if (!voucherName || !discountValue || !maxDiscount || !startDate || !endDate || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin voucher'
            });
        }

        const newVoucher = new Voucher({
            voucherName,
            discountValue,
            maxDiscount,
            startDate,
            endDate,
            quantity
        });

        await newVoucher.save();
        res.status(201).json({
            success: true,
            message: 'Tạo voucher thành công!',
            voucher: newVoucher
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo voucher: ' + err.message
        });
    }
});

// Route xóa voucher
router.delete('/:id', async (req, res) => {
    try {
        const voucher = await Voucher.findByIdAndDelete(req.params.id);
        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy voucher'
            });
        }
        res.json({
            success: true,
            message: 'Xóa voucher thành công!'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa voucher: ' + err.message
        });
    }
});

export default router;