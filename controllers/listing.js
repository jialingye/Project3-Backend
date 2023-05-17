////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Listing = require("../models/listing");
require("dotenv").config();
const {GOOGLE_API_KEY} = process.env;
///////////////////////////////

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

// ROUTES
////////////////////////////////

  // LISTING INDEX ROUTE
  router.get("/", async (req, res) => {
    try {
      // send all listing
      res.json(await Listing.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  //search 
  router.get('/search', async(req,res) =>{
    const location = req.query.location;
    const guestNumber = req.query.guestNumber;

    const query = {};
    if(guestNumber){
      query.guestNumber = guestNumber;
    }
    if(location){
      query.location = location;
    }
    //*****date not finish yet
    //find query object in mongodb
  try{
    const result=await Listing.find(query);
    res.json (result);
  } catch (err) {
    console.error(err);
    res.status(500).send('server error')
  }
  })

  //filter 
router.get('/filter', async(req,res) =>{
  //defined query variable
  const roomNumber = req.query.roomNumber;
  const bedNumber = req.query.bedNumber ;
  const bathroomNumber = req.query.bathroomNumber;
  const propType = req.query.propType;
  const amenities = req.query.amenities;
  const maxPrice= req.query.maxPrice;
  
  //make query object
  const query={};
  if(roomNumber){
    query.roomNumber = roomNumber;
  }
  if (bedNumber){
    query.bedNumber = bedNumber;
  }
  if(bathroomNumber){
    query.bathroomNumber = bathroomNumber;
  }
  if(propType){
    query.propType = propType;
  }
  if (amenities){
    query.amenities = {$all: amenities};
  }
  if(maxPrice){
    query.maxPrice = {$lte: maxPrice};
  }

  //find query object in mongodb
  try{
    const result=await Listing.find(query);
    res.json (result);
  } catch (err) {
    console.error(err);
    res.status(500).send('server error')
  }
})
  
  // GET by id
router.get("/:id", async (req, res) => {
  try {
    res.json(await Listing.findById(req.params.id)).status(200);
  } catch (error) {
    res.status(400).json(error);
    console.log("error", error);
  } finally {
    console.log("this is finally");
  }
});

  // LISTING CREATE ROUTE
  router.post("/", async (req, res) => {
    try {
      const {default: fetch} = await import('node-fetch');
      const {address, ... otherData} = req.body;
      const apiKey = GOOGLE_API_KEY;
      const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      
      const response = await fetch(geocodingUrl);
        const data = await response.json();
        const {lat, lng} = data.results[0].geometry.location;
    
      const listing = await Listing.create({
        address,
        location: {
          lat,
          lng,
        },
        ...otherData
      });

    // console.log(listing)
     //*****ask david how to use postman to test without hard code the user id
    // const populatedListing = await listing.populate('host').execPopulate();
    // console.log(populatedListing)
    // res.json(populatedListing);
    res.json(listing);

    } catch (error) {
      if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ error: validationErrors });
    }
    console.log(error)
    // Handle other types of errors
    return res.status(500).json({ error: 'Internal server error' });
      }
  });


  
  // LISTING UPDATE ROUTE
  router.put("/:id", async (req, res) => {
    try {
      const {default: fetch} = await import('node-fetch');
      const {address, ... otherData} = req.body;
      const apiKey = 'AIzaSyCp3FsMulLY9P36rd-cwcyWvwA1LEcbi8s';
      const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      
      const response = await fetch(geocodingUrl);
        const data = await response.json();
        const {lat, lng} = data.results[0].geometry.location;
  
      // send all listing
      res.json(
        await Listing.findByIdAndUpdate(
          req.params.id, 
          {address, location:{lat, lng}, ... otherData}, 
          { new: true })
      );
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // LISTING DELETE ROUTE
  router.delete("/:id", async (req, res) => {
    try {
      // send all listing
      res.json(await Listing.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

  module.exports = router;