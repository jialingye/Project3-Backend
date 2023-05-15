const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isHost: {
        type: Boolean,
        default: false,
    },
    listing: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
    }],
    bookings:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
    }],
    savedListing:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
    }],
    reviewsReceived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
    reviewsGiven:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;