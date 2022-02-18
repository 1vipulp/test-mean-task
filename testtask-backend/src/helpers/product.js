'use strict'
const productService = require('../services/product')

module.exports.fetchProducts = async (req, res) => {
    try {
        const payload = {
            page_size: req.query.page_size ? +req.query.page_size : null,
            page_number: req.query.page_number ? +req.query.page_number : null
        }
        console.log(payload)
        const response = await productService.fetchProducts(payload)
        return res.send(response)
    } catch (error) {
        return res.status(500).send(error)
    }
}

module.exports.addProduct = async (req, res) => {
    try {
        const body = req.body
        const response = await productService.addProduct(body)
        return res.send(response)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const response = await productService.deleteProduct(req.params.id)
        return res.send(response)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

module.exports.ediProduct = async (req, res) => {
    try {
        const response = await productService.ediProduct(req.params.id, req.body)
        return res.send(response)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}