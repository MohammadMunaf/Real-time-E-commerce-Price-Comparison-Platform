
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const { v4: uuid4 } = require('uuid');
const path = require('path');
const methodOverride = require('method-override');
const scraper = require('./scraper.js');
const amazonitem = require('./schema/amazon.js');
const flipkartitem = require('./schema/flipkart.js')

const mongoose = require('mongoose');
const amazonProduct = require("./schema/amazon.js");
const flipkartProduct = require("./schema/flipkart.js");

const dburl = process.env.DB_URL
mongodb://127.0.0.1:27017/products
mongoose.connect(dburl)
    .then(() => {
        console.log("connection open");
    })
    .catch(err => {
        console.log(`error:${err}`);
    })

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(methodOverride('_methid'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
})

// app.get('/show', async (req, res) => {

// })

app.post('/show', async (req, res) => {
    await amazonProduct.deleteMany();
    await flipkartProduct.deleteMany();
    const { input } = req.body;
    //console.log(input);
    const amazonp=await scraper.Amazon(input);
    const flipkartp=await scraper.Flipkart(input);
    // const amazonp = await amazonitem.find({});
    // const flipkartp = await flipkartitem.find({});
    res.render('show', { amazonp, flipkartp });
})


app.listen(PORT, () => {
    console.log(`Listining on port ${PORT}`)
})