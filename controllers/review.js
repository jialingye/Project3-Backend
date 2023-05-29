// require dependencies
const express = require('express');
const Review = require('../models/review');
const User = require('../models/user');
const MongoClient = require('mongodb').MongoClient;
const Listing = require('../models/listing');

// initialize router
const router = express.Router();




router.get('/:listingID', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingID).populate('reviews');
        res.json(listing);
    } catch (error) {
        res.status(400).json(error);
    }
});


// router.get('/:listingID', async (req, res) => {
//     try { 
//         res.json(await Listing.findById(req.params.listingID))
//         // locating the Review by Document Id
//         // res.json(await Review.findById(req.params.id)).status(200);
 
//     } catch (error) { 

//         res.status(400).json(error);

//     }

// })
router.post('/id', async (req, res) => {

})


// POST  Create Review Route
router.post('/', async (req,res) => {
    // attach user id to review 

    console.log(req.body);

    // const { listing } = req.body;
    const newReview = await Review.create(req.body);
    // console.log(newReview);

    const PropertyListing = await Listing.findById(req.body.listing)
    // console.log(PropertyListing.reviews);
    PropertyListing.reviews.push(newReview.id);
    console.log(PropertyListing);
    await PropertyListing.save();

    const reviewer = await User.findById(req.body.reviewer)
    console.log(req.body.reviewer);
    console.log(reviewer);

    reviewer.reviewsGiven.push(newReview.id);
    await reviewer.save();
    res.json(newReview)
})

// REVIEW UPDATE ROUTE
router.put("/:id", async (req, res) => {
    try {
        // review update
        res.json(
          await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});



// PUT route for editing a review
router.put('/reviews/:reviewID', async (req, res) => {
    try { 
        const updatedReview = await Review.findByIdAndUpdate(req.params.reviewID, req.body, { new: true });
        if (!updatedReview) {
            return res.status(404).json({ message: "No review found with this id" });
        }
        res.json(updatedReview);
    } catch (error) { 
        res.status(400).json(error);
    }
});

// DELETE route for deleting a review
router.delete('/reviews/:reviewID', async (req, res) => {
    try { 
        const deletedReview = await Review.findByIdAndDelete(req.params.reviewID);
        if (!deletedReview) {
            return res.status(404).json({ message: "No review found with this id" });
        }
        res.json(deletedReview);
    } catch (error) { 
        res.status(400).json(error);
    }
});



module.exports = router

// Get all reviews
// router.get('/', async (req, res) => {
//     try {
//       const reviews = await Review.find();
//       res.json(reviews);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch reviews' });
//     }
//   });


// router.get('/', (req, res) => {


//     console.log('here')
//     // MongoDB connection URI, database name, and colleciton name
//     const uri = process.env.MONGODB_URL
//     const dbName = 'airbnb'
//     const collectionName = 'users'
//     try {
//         console.log('try block')
//         MongoClient.connect(uri,function (err, client) {
//             console.log('mongo block');
//             if(err) {
//                 console.log('Error connection to MongoDB:', err);
//                 return res.status(500).json({ error: 'Failed to connect to MongoDB'});

//             }
//             const db = client.db(dbName);
//             const collection = db.collection(collectionName);

//             const query = { username: 'berry'};
//             collection.findOne(query, function (err, document) {
//                 if (err) {
//                     console.log('Error retrieving document:', err);
//                     return res.status(500).json({ error: 'Failed to fetch document' })
//                 }

//                 console.log('Document found:', document);
//                 res.json(document);
//                 client.close();
//             });
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ error: 'Failed to search for document' });
//     }

// })











// try {
//     console.log('entered review try block')

//     const uri = process.env.MONGODB_URL;
//     const dbName = 'airbnb';
//     const collectionName = 'reviews';

//     console.log("connecting to MongoDB..")
//     MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, async (error, client) => {
//         console.log('connected to MongoDB')
//       if (error) {
//         console.error('Error connecting to MongoDB:', error);
//         return;
//       }
//       console.log('reached nested try block')
//       try {
//         console.log('entered nested try block')
//         const db = client.db(dbName);
//         const collection = db.collection(collectionName);
  
//         const review = req.body;
  
//         const result = await collection.insertOne(review);
  
//         console.log('Review created:', result.insertedId);
  
//         // Send a response indicating success
//         res.json({ message: 'Review created successfully!' });
//       } catch (error) {
//         console.error('Error creating review:', error);
//         res.status(500).json({ error: 'Failed to create review' });
//       } finally {
//         // Close the MongoDB connection
//         client.close();
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }


// LATEST WORKING '/' GET 

// console.log('here')

//     const uri = process.env.MONGODB_URL
//     const dbName = 'airbnb'
//     const collectionName = 'users'

//     console.log('try block')
    
//     try {
//         console.log("right before mongo")
//         const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('mongo block');
        
//         const db = client.db(dbName);
//         const collection = db.collection(collectionName);

//         const query = { username: 'berry' };
//         const  document  = await collection.findOne(query);
//         const reviewerDocuemtnID =  document._id.toString();

//         console.log('Document found:', reviewerDocuemtnID);
//         res.json(document);

//         client.close();
//     } catch (error) {
//         console.log('Error:', error);
//         res.status(500).json({ error: 'Failed to search for document' });
//     }
// });