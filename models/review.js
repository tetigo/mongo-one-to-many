const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    starts: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    }
})

const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review

