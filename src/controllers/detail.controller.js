import mongoose from 'mongoose'
import event from '../models/event.model.js'
import MongooseToObjectFunctions from '../utils/mongooseToObjectFunctions.js';
class EventDetailController {
    getEventDetail = async (req, res, next) => {
        if(req.session.customer){
            const customer = req.session.customer;
            await event.findOne({ _id: req.params.id })
                .then(event => {
                    res.render('eventDetail/eventPage.ejs', { customer, event: MongooseToObjectFunctions.mongooseToObject(event)});
                })
                .catch(next => {
                    console.log(next.message);
                })
        }

    }
}

export default new EventDetailController()

