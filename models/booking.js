const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        index: true,
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value){
                return value < this.endDate;
            },
            message: 'Start date must be before the end date',
        }
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value){
                return value > this.startDate;
            },
            message: 'End date must be after the start date',
        }
    },
    address:{
        type: String,
        default:"",
    },
    image: {
        type: String,
        default:"",
    },
    city:{
        type: String,
        default: "",
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})


const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;