const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product Name is Required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity of Product is Required']
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product