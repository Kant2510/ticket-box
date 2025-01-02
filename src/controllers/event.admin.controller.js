'use strict';

import EventModel from '../models/event.model.js';
import { ApiError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

class EventController {
    // GET /event - Render event creation form
    async createEvent(req, res) {
        try {
            res.render('createEvent');
        } catch (error) {
            console.error('Error rendering event creation page:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Error rendering event creation page',
                error: error.message
            });
        }
    }

    // POST /event - Handle event creation
    async handleCreateEvent(req, res) {
        try {
            console.log('Creating new event with data:', req.body);

            const {
                title,
                addressProvince,
                addressDetail,
                startDate,
                endDate,
                eventLogo,
                eventBanner,
                organizerId,
                category,
                status,
                description,
                eventType,
                venueName,
                district,
                ticketTypes
            } = req.body;

            // Validate ticket types
            if (!ticketTypes || !Array.isArray(ticketTypes)) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: 'Ticket types must be an array'
                });
            }

            // Create new event instance
            const newEvent = new EventModel({
                title,
                addressProvince,
                addressDetail,
                startDate,
                endDate,
                eventLogo,
                eventBanner,
                organizerId,
                category,
                status: status || 'Draft',
                description,
                eventType,
                venueName,
                district,
                ticketTypes: ticketTypes.map(ticket => ({
                    ticketTypeId: Math.random().toString(36).substring(7),
                    name: ticket.name,
                    quantity: Number(ticket.quantity),
                    price: Number(ticket.price),
                    description: ticket.description || ''
                }))
            });

            // Save to database
            const savedEvent = await newEvent.save();
            console.log('Event created successfully:', savedEvent);

            res.status(HTTP_STATUS.CREATED).json({
                message: 'Event created successfully',
                data: savedEvent
            });

        } catch (error) {
            console.error('Error creating event:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Error creating event',
                error: error.message
            });
        }
    }

    // GET /events - Get all events
    async getAllEvents(req, res) {
        try {
            const {
                category,
                province,
                district,
                startDate,
                endDate,
                status,
                eventType
            } = req.query;

            // Build filter object
            let filter = {};

            if (category) filter.category = category;
            if (province) filter.addressProvince = province;
            if (district) filter.district = district;
            if (status) filter.status = status;
            if (eventType) filter.eventType = eventType;

            // Date range filter
            if (startDate || endDate) {
                filter.startDate = {};
                if (startDate) filter.startDate.$gte = new Date(startDate);
                if (endDate) filter.startDate.$lte = new Date(endDate);
            }

            const events = await EventModel.find(filter)
                .sort({ createdAt: -1 });

            res.status(HTTP_STATUS.OK).json({
                message: 'Events retrieved successfully',
                data: events
            });

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Error retrieving events',
                error: error.message
            });
        }
    }

    // GET /event/:id - Get single event
    async getEventById(req, res) {
        try {
            const { id } = req.params;

            const event = await EventModel.findById(id);

            if (!event) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: 'Event not found',
                    error: 'Event not found'
                });
            }

            // Increment visit count
            event.visitCount = (event.visitCount || 0) + 1;
            await event.save();

            res.status(HTTP_STATUS.OK).json({
                message: 'Event retrieved successfully',
                data: event
            });

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Error retrieving event',
                error: error.message
            });
        }
    }

    // PUT /event/:id - Update event
    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Convert dates if provided
            if (updateData.startDate) {
                updateData.startDate = new Date(updateData.startDate);
            }
            if (updateData.endDate) {
                updateData.endDate = new Date(updateData.endDate);
            }

            const updatedEvent = await EventModel.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true }
            );

            if (!updatedEvent) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: 'Event not found',
                    error: 'Event not found'
                });
            }

            res.status(HTTP_STATUS.OK).json({
                message: 'Event updated successfully',
                data: updatedEvent
            });

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Error updating event',
                error: error.message
            });
        }
    }

    // DELETE /event/:id - Delete event
    async deleteEvent(req, res) {
        try {
            const { id } = req.params;

            const deletedEvent = await EventModel.findByIdAndDelete(id);

            if (!deletedEvent) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: 'Event not found',
                    error: 'Event not found'
                });
            }

            res.status(HTTP_STATUS.OK).json({
                message: 'Event deleted successfully',
                data: deletedEvent
            });

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Error deleting event',
                error: error.message
            });
        }
    }

    // POST /event/:eventId/ticket - Add ticket type to event
    async addTicketType(req, res) {
        try {
            const { eventId } = req.params;
            const { name, price, quantity, description } = req.body;

            console.log('Adding ticket type to event:', eventId);
            console.log('Ticket data:', req.body);

            // Find event
            const event = await EventModel.findById(eventId);
            if (!event) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: 'Event not found'
                });
            }

            // Ensure ticketTypes is an array
            if (!Array.isArray(event.ticketTypes)) {
                event.ticketTypes = [];
            }

            // Create new ticket
            const newTicket = {
                ticketTypeId: Math.random().toString(36).substring(7),
                name,
                price: Number(price),
                quantity: Number(quantity),
                description: description || ''
            };

            // Add to array
            event.ticketTypes.push(newTicket);

            // Save changes
            const updatedEvent = await event.save();
            console.log('Ticket added successfully:', newTicket);
            console.log('Updated event:', updatedEvent);

            res.status(HTTP_STATUS.OK).json({
                message: 'Ticket type added successfully',
                data: updatedEvent
            });

        } catch (error) {
            console.error('Error adding ticket type:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Error adding ticket type',
                error: error.message
            });
        }
    }
}

export default new EventController();