import EventService from '../services/event.service.js'
import TicketTypeService from '../services/ticket_type.service.js'

const getHomepage = async (req, res) => {
        const events = await EventService.findRecomendedEvents()
        const recommendTicketTypes = await TicketTypeService.findByRecommend()
        const newReleaseTicketTypes = await TicketTypeService.findByNewRelease()
        // get the first of recommendedTicketTypes and the 3 first of newReleaseTicketTypes
        const nowShowing = [recommendTicketTypes[0]].concat(newReleaseTicketTypes.slice(0, 3))
        console.log('nowShowing:', nowShowing)
        try{
            const customer = req.session.customer;
            res.render('index', { customer, events, nowShowing })

    } catch (error) {
            res.render('index', { customer: null, events, nowShowing })    }
    // return res.render('index')
}

export default getHomepage
