////////////////////////////////////////////
//Dependencies
////////////////////////////////////////////
const express = require("express");
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

// ROUTES
////////////////////////////////

  //REVIEW INDEX ROUTE
  router.get("/", async (req, res) => {
    try {
      // send all listing
      res.json(await Review.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

  
  // REVIEW CREATE ROUTE
  router.post("/", async (req, res) => {
    try {   
      const review = await Review.create(req.body);

      const listing = await Listing.findById(req.body.listing)
      listing.reviews.push(review.id)
      await listing.save();
      const populatedListing = await listing.populate('reviews')
      await populatedListing.calculateRating();
      await populatedListing.save();
    

      const user = await User.findById(req.body.reviewer);
      user.reviewsGiven.push(review.id)
      await user.save();

      res.json(review);
    } catch (error) {
      console.log(error)
    }
  });

  //filter 
router.get('/filter', async(req,res) =>{
    //defined query variable
    const overallRating = req.query.overallRating;
    
    //make query object
    const query={};
    if(overallRating){
      query.overallRating = overallRating;
    }
    //find query object in mongodb
    try{
      const result=await Review.find(query);
      res.json (result);
    } catch (err) {
      console.error(err);
      res.status(500).send('server error')
    }
  })

    // GET by id
router.get("/:id", async (req, res) => {
    try {
      res.json(await Review.findById(req.params.id)).status(200);
    } catch (error) {
      res.status(400).json(error);
      console.log("error", error);
    } finally {
      console.log("this is finally");
    }
  });


  
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
  
  // REVIEW DELETE ROUTE
  router.delete("/:id", async (req, res) => {
    try {
      // send all listing
      res.json(await Review.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

  module.exports = router;