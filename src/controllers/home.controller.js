import EventService from '../services/event.service.js'
import TicketTypeService from '../services/ticket_type.service.js'

const getHomepage = async (req, res) => {
    try {
        const events = await EventService.findRecomendedEvents()
        const recommendTicketTypes = await TicketTypeService.findByRecommend()
        const newReleaseTicketTypes = await TicketTypeService.findByNewRelease()
        // get the first of recommendedTicketTypes and the 3 first of newReleaseTicketTypes
        const nowShowing = [recommendTicketTypes[0]].concat(newReleaseTicketTypes.slice(0, 3))
        console.log('nowShowing:', nowShowing)
        if(req.session.customer){
            const customer = req.session.customer;
            res.render('index', { customer, events, nowShowing })
        } else{
            res.render('index', { customer: null, events, nowShowing })

        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to load events' })
    }
}

export default getHomepage
