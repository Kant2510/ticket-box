'use strict'

import { OkResponse } from '../core/success.response.js'
import { faker } from '@faker-js/faker'
// import { BadRequestResponse } from '../core/error.response.js'
// import OrderService from '../services/order.service.js'

// TODO: API login
const getCart = async (req, res) => {
    try {
        // const orders = await OrderService.findByCategory(req.body)
        // res.status(200).json(orders)
        const tickets = Array.from({ length: 5 }).map(() => ({
            id: faker.datatype.uuid,
            image: faker.image.avatarGitHub(), // Ảnh ngẫu nhiên
            name: faker.commerce.productName(),
            price: faker.commerce.price(100000, 1000000), // Giá vé ngẫu nhiên từ 100.000 đến 1.000.000
            quantity: 1, // Ví dụ, mỗi ticket bắt đầu với số lượng 1
        }))

        // Sinh ngẫu nhiên danh sách voucher
        const vouchers = Array.from({ length: 3 }).map(() => ({
            id: faker.datatype.uuid,
            name: faker.commerce.productName(),
            discount: faker.number.float(0.05, 0.5), // Giảm giá ngẫu nhiên từ 5% đến 50%
        }))

        // Tính toán tổng giá trị của vé
        const totalPrice = tickets.reduce((total, ticket) => total + ticket.price * ticket.quantity, 0)

        // Tính tổng giảm giá
        const totalDiscount = vouchers.reduce((total, voucher) => total + (voucher.discount / 100) * totalPrice, 0)

        // Tổng giá sau khi giảm
        const finalPrice = totalPrice - totalDiscount

        // Truyền dữ liệu vào view EJS
        res.render('cart', {
            customer: req.session.customer,
            tickets,
            vouchers,
            totalPrice,
            totalDiscount,
            finalPrice,
        })
        // res.render('cart')
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const OrderController = {
    getCart,
}

export default OrderController
