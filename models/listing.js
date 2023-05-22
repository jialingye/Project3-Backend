const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    images: {
        type: [String],
        required: false,
    },
    types: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    size: {
        type: String,
        required: false,
    },
    location: {
        country: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        state: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        }
    },
    amenties: {
        type: [String],
        required: false,
    },
    number: {
        guestNumber: {
            type: Number,
            required: false,
        },
        bedroomNumber: {
            type: Number,
            required: false,
        },
        bedNumber: {
            type: Number,
            required: false,
        },
        bathroomNumber:{
            type: Number,
            required: false,
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