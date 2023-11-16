const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlipkartSchema = new Schema({
    url: String,
    title: [String],
    price: String,
    rating: String,
    link:String
})


const flipkartProduct = mongoose.model('FlipkartProduct', FlipkartSchema);

module.exports = flipkartProduct;