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
    db.Product.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true })
        .then(dbProduct => res.json(dbProduct))
        .catch(err => res.json(err))
})

app.delete('/products/:id', (req, res) => {
    db.Product.findOneAndDelete({ _id: req.params.id })
        .then(dbProduct => res.json(dbProduct))
        .catch(err => res.json(err))
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
            return db.Product.findOneAndUpdate({ _id: req.params.id }, { $push: { reviews: dbReview._id } }, { new: true })
                .then(dbProduct => res.json(dbProduct))
                .catch(err => res.json(err))

        })
})

app.put('/reviews/:id', (req, res) => {
    db.Review.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: false })
        .then(dbReview => res.json(dbReview))
        .catch(err => res.json(err))
})

app.delete('/reviews/:id', (req, res) => {
    // db.Review.findById({ _id: req.params.id })
    //     .then(dbReview => {
    //         db.Product.findOneAndUpdate(
    //             { _id: dbReview.product },
    //             { $pull: { reviews: { $in: dbReview.product } } },
    //             { multi: true }
    //         )
    //     })
    db.Review.findOneAndDelete({ _id: req.params.id })
        .then(dbReview => res.json(dbReview))
        .catch(err => res.json(err))
})

app.listen(PORT, () => console.info('listening on port ' + PORT))

