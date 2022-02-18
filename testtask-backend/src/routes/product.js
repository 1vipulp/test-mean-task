'use strict'

const router = require('express').Router()
const productHelper = require('../helpers/product')

router.get('/', productHelper.fetchProducts)
router.put('/', productHelper.addProduct)
router.delete('/:id', productHelper.deleteProduct)
router.post('/:id', productHelper.ediProduct)

module.exports = router