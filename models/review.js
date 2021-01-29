const mongoose = require('mongoose')
const { db } = require('./product')

const ReviewSchema = new mongoose.Schema({
    stars: {
        type: Number,
        min: [0, 'Minimum Stars is 0'],
        max: [5, 'Maximum Stars is 5'],
        required: [true, 'Stars Required']
    },
    review: {
        type: String,
        required: [true, 'Review Required']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }

})

const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review

