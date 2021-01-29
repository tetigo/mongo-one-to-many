const express = require('express')
const mongoose = require('mongoose')

const db = require('./models')
console.log(db)

const options = {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
}
mongoose.connect('mongodb://localhost:27017/grocerydb', options)

const PORT = 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello from Narnia'))

app.get('/products', (req, res) => {
    db.Product.find({})
        .then(dbProducts => res.json(dbProducts))
        .catch(err => res.json(err))
})

app.get('/products/:id', (req, res) => {
    db.Product.findOne({ _id: req.params.id })
        .populate('reviews')
        .then(dbProduct => res.json(dbProduct))
        .catch(err => res.json(err))
})

app.post('/products', (req, res) => {
    db.Product.create(req.body)
        .then(dbProduct => res.json(dbProduct))
        .catch(err => res.json(err))
})

app.put('/products/:id', (req, res) => {
    db.Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true })
        .then(dbProduct => res.json(dbProduct))
        .catch(err => res.json(err))
})

app.delete('/products/:id', async (req, res) => {
    try {
        const product = await db.Product.findOneAndDelete({_id: req.params.id})
        const reviews = await db.Review.deleteMany({_id: {$in: product.reviews}})
        return res.json(reviews)
    } catch (err) {
        res.json(err)
    }
})

//-------------------------------------------------------------

app.get('/reviews', (req, res) => {
    db.Review.find({})
        .then(dbReviews => res.json(dbReviews))
        .catch(err => res.json(err))
})

app.get('/reviews/:id', (req, res) => {
    db.Review.findOne({ _id: req.params.id })
        .then(dbReview => res.json(dbReview))
        .catch(err => res.json(err))
})

app.post('/products/:id', (req, res) => {
    let objReview = req.body
    objReview.product = req.params.id
    db.Review.create(objReview)
        .then(dbReview => {
            return db.Product.findOneAndUpdate({ _id: req.params.id }, { $push: { reviews: dbReview._id } }, { new: true, upsert: true })
                .then(dbProduct => res.json(dbProduct))
                .catch(err => res.json(err))

        })
})

app.put('/reviews/:id', (req, res) => {
    db.Review.findOneAndUpdate({ _id: req.params.id }, req.body, { new: false, upsert: true })
        .then(dbReview => res.json(dbReview))
        .catch(err => res.json(err))
})

app.delete('/reviews/:id', async(req, res) => {
    try {
        const review = await db.Review.findOneAndDelete({_id: req.params.id})
        const product = await db.Product.updateOne(
            {_id: review.product},
            {$pull: {reviews: review._id}}
        )
        return res.json(product)
    } catch (err) {
        res.json(err)
    }
})

app.listen(PORT, () => console.info('listening on port ' + PORT))

