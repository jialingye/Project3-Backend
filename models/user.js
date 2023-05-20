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
    description: {
        type: String,
        default: ""
    },
    occupation: {
        type: String,
        default: ""
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
    reviewsGiven:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;