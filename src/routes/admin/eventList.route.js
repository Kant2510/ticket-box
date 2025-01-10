import express from 'express';
import EventModel from '../../models/event.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        const totalEvents = await EventModel.countDocuments({ status: 'Active' });

        const events = await EventModel.find({ status: 'Active' })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ startDate: 'asc' })
            .select('title startDate endDate status ticketType imgUrl addressDetail');

        const transformedEvents = events.map(event => ({
            _id: event._id,
            name: event.title,
            date: event.startDate,
            time: event.startDate ? new Date(event.startDate).toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }) : 'Chưa cập nhật',
            status: event.ticketType && event.ticketType.length > 0 ? 'on-sale' : 'sold-out',
            availableTickets: event.ticketType ? event.ticketType.length : 0,
            location: event.addressDetail || 'Chưa cập nhật'
        }));

        res.render('eventList', { // Render template eventList
            events: transformedEvents,
            currentPage: page,
            hasNextPage: limit * page < totalEvents,
            totalPages: Math.ceil(totalEvents / limit)
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Lỗi khi tải danh sách sự kiện');
    }
});

export default router;
