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
    totalPrice: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;