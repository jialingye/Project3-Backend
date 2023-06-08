////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const axios = require("axios");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const {GOOGLE_API_KEY, SECRET} = process.env;
///////////////////////////////

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

// ROUTES
////////////////////////////////

// LISTING INDEX ROUTE
router.get("/", async (req, res) => {
  console.log(req.query)
  // Filter
  for (let key in req.query){
    if(key === "price") {
      console.log(`${key}=${req.query[key]}`,"first console.loggggg priceee")
      req.query[key] = {$lte:req.query[key],$gte:0};
    } else if(key === "amenities") {
      console.log(`${key}=${req.query[key]}`, "second console.loggggg amenities")
      const amenitiesArray =  req.query[key].split(",");
      req.query[key] = {$all: amenitiesArray}
    } else {
      console.log(`${key}=${req.query[key]}`, "3 console.loggggg othersssssss")
      req.query[key] = {$gte:req.query[key]};
    }
  }
  console.log(req.query);  
  // Get all properties
  let properties;
  try {
    properties = await Listing.find(req.query)
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

// get saved listing
router.get("/:id/save", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Please provide a valid token" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, SECRET);
      //console.log("😫", decodedToken);

      const userId = decodedToken.id;
      if (!userId) {
        return res.status(401).json({ error: "userId is not found." });
      }

      const user = await User.findById(userId);
      const isSaved = user.savedListing.includes(req.params.id);
      res.status(200).json({ isSaved });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});






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

//filter 	
router.get('/filter',async(req,res)=>{
  //defined query variable
  constroomNumber=req.query.roomNumber;
  constbedNumber=req.query.bedNumber;
  constbathroomNumber=req.query.bathroomNumber;
  constpropType=req.query.propType;
  constamenities=req.query.amenities;
  constmaxPrice=req.query.maxPrice;
  //make query object
  constquery={};
  if(roomNumber){
  query.roomNumber=roomNumber;
  }
  if(bedNumber){
  query.bedNumber=bedNumber;
  }
  if(bathroomNumber){
  query.bathroomNumber=bathroomNumber;
  }
  if(propType){
  query.propType=propType;
  }
  if(amenities){
  query.amenities={$all: amenities};
  }
  if(maxPrice){
  query.maxPrice={$lte: maxPrice};
  }
  //find query object in mongodb
  try{
  constresult=awaitListing.find(query);
  res.json(result);
  }catch(err){
  console.error(err);
  res.status(500).send('server error')
  }
 })


  // Angela LISTING CREATE ROUTE
  router.post("/", async (req, res) => {
    try {   
        // Get coordinates from adress
        const locationResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            req.body.address
        )}&key=${GOOGLE_API_KEY}`)

        const coordinates = locationResponse.data.results[0].geometry.location;

        const typesToFind = ['locality', 'neighborhood', 'administrative_area_level_1'];
        console.log(locationResponse.data.results[0].address_components)
        const cityComponent = locationResponse.data.results[0].address_components.find(
            (component) => typesToFind.some(type => component.types.includes(type))
        );
        
        const city = cityComponent ? cityComponent.long_name : '';

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
        console.log(locationResponse.data.results[0].address_components)
        const typesToFind = [ 'administrative_area_level_1', 'locality', 'neighborhood'];
        const cityComponent = locationResponse.data.results[0].address_components.find(
            (component) => typesToFind.some(type => component.types.includes(type))
        );
        
        const city = cityComponent ? cityComponent.long_name : '';
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
  // SAVE
  router.post("/:id/save", async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if(!token){
        return res.status(401).json({error: "Please provide a valid token"})
      }

      const decodedToken = jwt.verify(token, SECRET);
      //console.log("🤯",decodedToken)
      const userId = decodedToken.id;
      
      if(!userId){
        return res.status(401).json({error: "userId is not found."})
      }

      const user = await User.findById(userId);
      user.savedListing.push(req.params.id)
      await user.save();
      
      res.status(200).json({message:"Listing has been saved."});
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
});
  
  // Delete listing
  router.delete("/:id/save", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if(!token){
        return res.status(401).json({error: "Please provide a valid token"})
      }

      const decodedToken = jwt.verify(token, SECRET);
      const userId = decodedToken.id;
      
      if(!userId){
        return res.status(401).json({error: "userId is not found."})
      }

      const user = await User.findById(userId);
      //console.log("😉", user)
      if(!user.savedListing.includes(req.params.id)){
        return res
          .status(400)
          .json({error:"Listing is not saved by user"});
      }
    
      user.savedListing.pull(req.params.id);
      await user.save();

    res.status(200).json({ message: "Listing removed from saved listings" });
  
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