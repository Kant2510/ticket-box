import mongoose, { Schema } from 'mongoose';

const DOCUMENT_NAME = 'Event';
const COLLECTION_NAME = 'Events';

const eventSchema = new Schema({
  title: {
    type: String,
    required: false
  },
  addressProvince: {
    type: String,
    required: false
  },
  addressDetail: {
    type: String,
    required: false
  },
  eventLogo: {
    type: String,
    required: false
  },
  eventBanner: {
    type: String,
    required: false
  },
  organizerId: {
    type: String,
    required: false
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  visitCount : {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: false
  },
  status: {
    type: String,
    default: 'Available'
  },
  description: {
    type: String,
    required: false
  },
  eventType: {
    type: String,
    required: false
  },
  venueName: {
    type: String,
    required: false
  },
  district: {
    type: String,
    required: false
  },
  ticketTypes: [{
    ticketTypeId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: false
    }
  }]
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

export default mongoose.model(DOCUMENT_NAME, eventSchema);