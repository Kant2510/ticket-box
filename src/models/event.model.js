import { model, Schema } from 'mongoose'
const DOCUMENT_NAME = 'EventModel'
const COLLECTION_NAME = 'Events'

// ticketType datatype
const ticketType = new Schema(
    {
        ticketTypeID: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imgUrl: {
            type: String,
            required: false,
        },
    },
    {
        _id: false,
    },
)

const eventSchema = new Schema(
    {
        addressProvince: {
            type: String,
            required: false,
        },
        addressDetail: {
            type: String,
            required: false,
        },
        startDate: {
            type: Date,
            required: false,
        },
        endDate: {
            type: Date,
            required: false,
        },
        visitCount: {
            type: Number,
            required: false,
        },
        category: {
            type: String,
            required: false,
        },
        // status with enum type
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
        title: {
            type: String,
            required: false,
        },
        ticketType: {
            type: [String],
            required: false,
        },
        organizerID: {
            type: String,
            required: false,
        },
        imgUrl: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
)

const EventModel = model(COLLECTION_NAME, eventSchema)

export default EventModel