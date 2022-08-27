const mongoose = require('mongoose');
const { Schema } = mongoose;

const DataSchema = new Schema({
    name: String,
    last: Number,
    buy: Number,
    sell: Number,
    volume: Number,
    base_unit: String
});

module.exports = mongoose.model("CryptoRecord", DataSchema);