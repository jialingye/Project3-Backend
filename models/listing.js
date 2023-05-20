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
    types: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    share: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        }
    },
    amenities: {
        type: [String],
        required: true,
    },
    guestNumber: {
            type: Number,
            required: true,
        },
    bedroomNumber: {
            type: Number,
            required: true,
        },
    bedNumber: {
            type: Number,
            required: true,
        },
    bathroomNumber:{
            type: Number,
            required: true,
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
    }
});

listingSchema.methods.calculateRating = function (){
    if(this.reviews.length === 0){
        this.rating = 0;
    } else {
        const totalRating = this.reviews.reduce((sum,review)=> sum + review.rating, 0);
        this.rating = totalRating / this.reviews.length;
    }
};

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;