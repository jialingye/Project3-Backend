const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
    },
    cleanlinessRating: {
        type: Number,
    },
    locationRating: {
        type: Number,
    },
    serviceRating: {
        type: Number,
    },
    overallRating: {
        type: Number,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }

});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;