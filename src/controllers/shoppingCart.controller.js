import ShoppingCart from '../models/shopping_cart.model.js'
import MongooseToObjectFunctions from '../utils/mongooseToObjectFunctions.js';

class ShoppingCartController {
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