'use strict'
const userService = require('../services/user')

module.exports.addToCart = async (req, res) => {
    try {
        const response = await userService.addToCart(req.body)
        return res.send(response)
    } catch (error) {
        return res.status(500).send(error)
    }
}

module.exports.getCartItems = async (req, res) => {
    try {
        const response = await userService.getCartItems()
        return res.send(response)
    } catch (error) {
        return res.status(500).send(error)
    }
}

module.exports.updateCartItem = async (req, res) => {
    try {
        const response = await userService.updateCartItem(req.body)
        return res.send(response)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

module.exports.deleteItem = async (req, res) => {
    try {
        const response = await userService.deleteItem(req.params.id)
        return res.send(response)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}