// require dependencies
const express = require('express');
const Review = require('../models/review');
const MongoClient = require('mongodb').MongoClient;

// initialize router
const router = express.Router();

// Create Route
router.post('/:reviewer/:listing', async (req,res) => {
    console.log('here')

    const uri = process.env.MONGODB_URL
    const dbName = 'airbnb'
    const collectionName = 'users'

    console.log('try block')
    
    try {
        console.log("right before mongo")
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('mongo block');
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const query = { username: 'berry' };
        const  document  = await collection.findOne(query);
        const reviewerDocuemtnID =  document._id.toString();

        console.log('Document found:', reviewerDocuemtnID);
        res.json(document);

        client.close();
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Failed to search for document' });
    }
    // try {
    //     const review = await Review.create(req.body);
    // } catch (error) {
    //     console.log(error);
    // }
})

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


router.get('/', async (req, res) => {
    console.log('here')

    const uri = process.env.MONGODB_URL
    const dbName = 'airbnb'
    const collectionName = 'users'

    console.log('try block')
    
    try {
        console.log("right before mongo")
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('mongo block');
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const query = { username: 'berry' };
        const  document  = await collection.findOne(query);
        const reviewerDocuemtnID =  document._id.toString();

        console.log('Document found:', reviewerDocuemtnID);
        res.json(document);

        client.close();
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Failed to search for document' });
    }
});



module.exports = router