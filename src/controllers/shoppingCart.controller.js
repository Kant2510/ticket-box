import ShoppingCart from '../models/shopping_cart.model.js'
import CustomerModel from '../models/customer.model.js'
import ShoppingCartModel from '../models/shopping_cart.model.js';
import EventModel from '../models/event.model.js'

class ShoppingCartController {
    getMyCart = async(req, res) => {
        try {
            const session_customer = req.session.customer;
            const _customer = await CustomerModel.findById(session_customer._id);
            const _customerCarts = await ShoppingCartModel.find({customerID: session_customer._id}).lean();
            let _cartEvents = [];
            if (_customerCarts) {
                _cartEvents = await Promise.all(
                    _customerCarts.map(async (cart) => {
                        const ticketTypeIDs = cart.items.map(item => item.ticketTypeID);
                        console.log(ticketTypeIDs);
                        // Tìm event từ ticketType
                        const _event = await EventModel.find({ ticketType: {$all: ticketTypeIDs}}).limit(1).lean();
                        console.log(_event);
                        return _event[0];
                    })
                );
            }

            const page = parseInt(req.query.page) || 1;
            const limit = 3;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedCarts = _cartEvents.slice(startIndex, endIndex);
            res.render('my-cart', {
                query: req.query,
                customer: _customer,
                carts: paginatedCarts,
                currentPage: page,
                totalPages: Math.ceil(_cartEvents.length / limit)
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).json("Internal Server Error");
        }
    }

    updateShoppingCart = async (req, res) => {
        const { customerID } = req.params;
        const { items } = req.body;

        try {
            // Update shopping cart
            // Có lẽ cần 1 thuộc tính EventID nữa? hoặc để create nhưng sẽ có event lặp lại
            const updatedCart = await ShoppingCart.findOneAndUpdate(
                { customerID: customerID },
                { items },
                { new: true, upsert: true }
            );
    
            res.status(200).json(updatedCart);
        } catch (error) {
            console.error('Error updating shopping cart:', error);
            res.status(500).json({ error: 'Failed to update shopping cart' });
        }
    }
}

export default new ShoppingCartController();