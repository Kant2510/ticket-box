import  mongoose, {model, Schema} from 'mongoose';
const DOCUMENT_NAME = 'EventModel';
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
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  visitCount: {
    type: Number,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  ticketTypes: {
    type: Array,
    required: false
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
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
  eventImages: {
    logo: {
      type: String,
      required: false
    },
    banner: {
      type: String,
      required: false
    }
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME,
});

const EventModel = model(DOCUMENT_NAME, eventSchema);

export default EventModel;