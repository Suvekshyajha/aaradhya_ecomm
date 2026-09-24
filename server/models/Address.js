const mongoose = require('mongoose');
const User = require('./User');

const AddressSchema = new mongoose.Schema({

    userId : String,
    address : String,
    city : String,
    pincode : String,
    phone : String,
    notes : String,

}, {timestamps : true})

module.exports = mongoose.model('Address', AddressSchema)




