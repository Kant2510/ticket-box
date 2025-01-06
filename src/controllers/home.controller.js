import EventService from '../services/event.service.js'
import TicketTypeService from '../services/ticket_type.service.js'

const getHomepage = async (req, res) => {
        const events = await EventService.findRecomendedEvents()
        const recommendTicketTypes = await TicketTypeService.findByRecommend()
        const newReleaseTicketTypes = await TicketTypeService.findByNewRelease()
        // get the first of recommendedTicketTypes and the 3 first of newReleaseTicketTypes
        const nowShowing = [recommendTicketTypes[0]].concat(newReleaseTicketTypes.slice(0, 3))
        try{
            res.render('index', {events, nowShowing })

    } catch (error) {
            res.render('index', {events, nowShowing })    }
}

export default getHomepage
