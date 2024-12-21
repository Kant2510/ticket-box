'use strict';

import EventModel from '../models/event.model.js';
import { ApiError } from '../../utils/apiError.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

class EventController {
  // GET /event - Render event creation form
  async createEvent(req, res) {
    try {
      res.render('createEvent');
    } catch (error) {
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error rendering event creation page');
    }
  }

  // POST /event - Handle event creation
  async handleCreateEvent(req, res) {
    try {
      const {
        title,
        addressProvince,
        addressDetail,
        startDate,
        endDate,
        category,
        status,
        ticketTypes,
        organizerId,
        description,
        eventType,
        venueName,
        district,
        eventImages
      } = req.body;

      // Create new event instance
      const newEvent = new EventModel({
        title,
        addressProvince,
        addressDetail,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        visitCount: 0,
        category,
        status,
        ticketTypes: Array.isArray(ticketTypes) ? ticketTypes : [],
        organizerId,
        description,
        eventType,
        venueName,
        district,
        eventImages: {
          logo: eventImages?.logo,
          banner: eventImages?.banner
        }
      });

      // Save to database
      const savedEvent = await newEvent.save();

      // Return success response
      res.status(HTTP_STATUS.CREATED).json({
        message: 'Event created successfully',
        data: savedEvent
      });

    } catch (error) {
      throw new ApiError(
        error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error.message || 'Error creating event'
      );
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
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Error retrieving events'
      );
    }
  }

  // GET /event/:id - Get single event
  async getEventById(req, res) {
    try {
      const { id } = req.params;
      
      const event = await EventModel.findById(id);
      
      if (!event) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Event not found');
      }

      // Increment visit count
      event.visitCount = (event.visitCount || 0) + 1;
      await event.save();

      res.status(HTTP_STATUS.OK).json({
        message: 'Event retrieved successfully',
        data: event
      });

    } catch (error) {
      throw new ApiError(
        error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Error retrieving event'
      );
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
        throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Event not found');
      }

      res.status(HTTP_STATUS.OK).json({
        message: 'Event updated successfully',
        data: updatedEvent
      });

    } catch (error) {
      throw new ApiError(
        error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Error updating event'
      );
    }
  }

  // DELETE /event/:id - Delete event
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      
      const deletedEvent = await EventModel.findByIdAndDelete(id);
      
      if (!deletedEvent) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Event not found');
      }

      res.status(HTTP_STATUS.OK).json({
        message: 'Event deleted successfully',
        data: deletedEvent
      });

    } catch (error) {
      throw new ApiError(
        error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Error deleting event'
      );
    }
  }
  async handleCreateEvent(req, res) {
    try {
      const {
        title,
        addressProvince,
        addressDetail,
        startDate,
        endDate,
        category,
        status,
        eventType,
        venueName,
        district,
        description,
        eventImages
      } = req.body;

      // Create new event instance
      const newEvent = new EventModel({
        title,
        addressProvince,
        addressDetail,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        visitCount: 0,
        category,
        status: status || 'draft',
        ticketTypes: [], // Will be added in step 2
        eventType,
        venueName,
        district,
        description,
        eventImages: {
          logo: eventImages?.logo || '',
          banner: eventImages?.banner || ''
        }
      });

      // Save to database
      const savedEvent = await newEvent.save();

      // Return success response
      res.status(HTTP_STATUS.CREATED).json({
        message: 'Event created successfully',
        data: savedEvent
      });

    } catch (error) {
      console.error('Error creating event:', error);
      throw new ApiError(
        error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error.message || 'Error creating event'
      );
    }
  }
}

export default new EventController();