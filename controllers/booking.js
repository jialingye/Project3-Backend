////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const User = require("../models/user");
///////////////////////////////

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

// ROUTES
////////////////////////////////

  // BOOKING INDEX ROUTE
  router.get("/", async (req, res) => {
    try {
      // send all booking
      res.json(await Booking.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

  // GET by id
router.get("/:id", async (req, res) => {
  try {
    res.json(await Booking.findById(req.params.id)).status(200);
  } catch (error) {
    res.status(400).json(error);
    console.log("error", error);
  } finally {
    console.log("this is finally");
  }
});
  
  // BOOKING CREATE ROUTE
  router.post("/", async (req, res) => {
    try {
        // get from body
        const {guest, listing, startDate, endDate} = req.body;
        //get the listing price,address,images
        const listingOb = await Listing.findById(listing);
        const {price,address,images,city} = listingOb; 
        const image = images[0];
        //calculate the days of stay
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start)/(1000*60*60*24));
        //calculate the price
        const totalPrice = days * price + price * days * 0.1
      try{
        const booking = await Booking.create({
          guest,
          listing,
          address,
          city,
          image,
          startDate,
          endDate,
          totalPrice,
        })
    
        const listingId = await Listing.findById(req.body.listing);
        listingId.bookings.push(booking.id);
        await listingId.save();

        const user = await User.findById(req.body.guest);
        user.bookings.push(booking.id);
        await user.save();

        res.json(booking);  
      } catch (error){
        console.log(error)
      }     
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // BOOKING UPDATE ROUTE
  router.put("/:id", async (req, res) => {
    try {
      const {guest, listing, startDate, endDate} = req.body;
      //get the listing price
      const listingOb = await Listing.findById(listing);
      const {price,address,images,city} = listingOb; 
      const image = images[0];
      //calculate the days of stay
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start)/(1000*60*60*24));
      //calculate the price
      const totalPrice = days * price + price * days * 0.1
      // send all people
      res.json(
        await Booking.findByIdAndUpdate(req.params.id, {guest,listing, startDate, endDate, address, city, image, totalPrice}, { new: true })
      );
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // BOOKING DELETE ROUTE
  router.delete("/:id", async (req, res) => {
    try {
      // send all people
      res.json(await Booking.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

  module.exports = router;