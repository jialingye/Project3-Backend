////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const axios = require("axios");
const User = require("../models/user");
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
    const {location, startDate, endDate, guestNumber} = req.query
   
    const query = {};
    if(guestNumber){
      query.guestNumber = {$gte: guestNumber};
    }
    if(location){
      query.address ={$regex: location, $options: "i"};
    }
    //find the booking 
    const bookings = await Booking.find({
      startDate: {$lte: endDate},
      endDate: {$gte: startDate}
    })

    const excludeListings = bookings.map((booking)=>booking.listing);
    query._id = {$nin: excludeListings};

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

        const city = data.results[0].address_components.find(
          (component) => component.types.includes('locality')
        ).long_name;
        // console.log(city)
        const country = data.results[0].address_components.find(
          (component) => component.types.includes('country')
        ).long_name;
    
        console.log(req.body)
      const listing = await Listing.create({
        address,
        city,
        country,
        location: {
          lat,
          lng,
        },
        // host: req.session.currentUser.id,
        ...otherData
      });
      const user = await User.findById(req.body.host);
      user.listing.push(listing.id)
      await user.save();

      

    res.json({property: listing});
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
      const apiKey = GOOGLE_API_KEY;
      const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      
      const response = await fetch(geocodingUrl);
        const data = await response.json();
        const {lat, lng} = data.results[0].geometry.location;
      
        const city = data.results[0].address_components.find(
          (component) => component.types.includes('locality')
        ).long_name;
        console.log(city)
        const country = data.results[0].address_components.find(
          (component) => component.types.includes('country')
        ).long_name;
        console.log(country)
        const updatedListing = await Listing.findByIdAndUpdate(
          req.params.id, 
          {address, city: city, country: country,location:{lat, lng}, ... otherData}, 
          { new: true })
      // send all listing
      res.json( updatedListing);
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