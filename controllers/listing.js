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
    let properties;
    try {
    // get all properties
        properties = await Listing.find({})
        res.status(200).json(properties)
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
        const property = await Listing.findById(req.params.id)
          .populate('host')
          .populate('bookings')
          .populate('reviews')
        res.status(200).json({property});
      } catch (error) {
        res.status(400).json(error);
      }
});

  // LISTING CREATE ROUTE
  router.post("/", async (req, res) => {
    try {   
        // Get coordinates from adress
        const locationResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            req.body.address
        )}&key=${GOOGLE_API_KEY}`)

        const coordinates = locationResponse.data.results[0].geometry.location;
        // console.log("----blablabal------")
        // console.log(locationResponse.data.results[0])
        // console.log(coordinates);
        // console.log("----blablabal------")

        const city = locationResponse.data.results[0].address_components.find(
          (component) => component.types.includes('locality')
        ).long_name;
        // console.log(city)
        const country = locationResponse.data.results[0].address_components.find(
          (component) => component.types.includes('country')
        ).long_name;
        // console.log(country)
        // Create the property in your database with the retrieved latitude and longitude
        const newProperty = await Listing.create({
            title: req.body.title,
            images: req.body.images,
            types: req.body.types,
            price: req.body.price,
            share: req.body.share,
            address: req.body.address,
            city: city,
            country: country,
            location: {
                lat: coordinates.lat,
                lng: coordinates.lng,
              },
            amenities: req.body.amenities,
            guestNumber: req.body.guestNumber,
            bedroomNumber: req.body.bedroomNumber,
            bedNumber: req.body.bedNumber,
            bathroomNumber: req.body.bathroomNumber,
            host: req.body.host,
        });

        const user = await User.findById(req.body.host);
        user.listing.push(newProperty.id);
        await user.save();

        // Return the newly created property in the response
        res.status(200).json({property: newProperty});
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
  });



  
  // LISTING UPDATE ROUTE
  router.put("/:id", async (req, res) => {
    try {
        // Get coordinates from adress
        const locationResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        req.body.address
        )}&key=${GOOGLE_API_KEY}`)

        const coordinates = locationResponse.data.results[0].geometry.location;

        const city = locationResponse.data.results[0].address_components.find(
          (component) => component.types.includes('locality')
        ).long_name;
        //console.log(city)
        const country = locationResponse.data.results[0].address_components.find(
          (component) => component.types.includes('country')
        ).long_name;
        //console.log(country)

        const updateListing = {
            ...req.body,
            city: city,
            country: country,
            location: {
              lat: coordinates.lat,
              lng: coordinates.lng,
            },
          };

        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, updateListing, { new: true })

        res.status(200).json(updatedListing);
    } catch (error) {
        console.log(error)
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