const mongoose = require('mongoose')

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

ReviewSchema.pre('deleteOne', { document: true }, function (next) {
    const review = this
    review.model('Product').updateMany(
        { reviews: review._id },
        { $pull: { reviews: review._id } },
        { multi: true },
        next
    )
})

const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review

