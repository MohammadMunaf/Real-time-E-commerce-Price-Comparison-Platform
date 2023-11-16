const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AmazonSchema = new Schema({
    url: String,
    title: [String],
    price: String,
    rating: String,
    link:String
})


const amazonProduct = mongoose.model('AmazonProduct', AmazonSchema);

module.exports = amazonProduct; 