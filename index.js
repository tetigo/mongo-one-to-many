const express = require('express')
const mongoose = require('mongoose')

const db = require('./models')
console.log(db)

mongoose.connect('mongoose://localhost/grocerydb', { useNewUrlParser: true })

const PORT = 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Hello from Narnia')
})

app.get('/products', (req, res) => {
    db.Product.find({})
        .then(dbProducts => {
            res.json(dbProducts)
        })
        .catch(err => res.json(err))
})

app.get('/reviews', (req, res) => {
    db.Review.find({})
        .then(dbReviews => {
            res.json(dbReviews)
        })
        .catch(err => res.json(err))
})

app.post('/product', (req, res) => {
    db.Product.create(req.body)
        .then(dbProduct => res.json(dbProduct))
        .catch(err => res.json(err))
})

app.post('/product/:id', (req, res) => {
    db.Review.create(req.body)
        .then(dbReview => {
            return db.Product.findOneAndUpdate({ _id: req.params.id }, { $push: { reviews: dbReview._id } }, { new: true })
                .then(dbProduct => res.json(dbProduct))
                .catch(err => res.json(err))

        })
})

app.get('/products/:id', (req, res) => {
    db.Product.findOne({ _id: req.params.id })
        .populate('reviews')
        .then(dbProduct => res.json(dbProduct))
        .catch(err => res.json(err))
})


app.listen(PORT, () => console.info('listening on port ' + PORT))

