const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    conditions: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        country: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        }
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

listingSchema.methods.calculateRating = function (){
    if(this.reviews.length === 0){
        this.rating = 0;
    } else {
        const totalRating = this.reviews.reduce((sum,review)=> sum + review.rating, 0);
        this.rating = totalRating / this.reviews.length;
    }
}

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;