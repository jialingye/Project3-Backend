////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Booking = require("../models/booking");
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
      // send all people
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
      // send all people
      res.json(await Booking.create(req.body));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // BOOKING UPDATE ROUTE
  router.put("/:id", async (req, res) => {
    try {
      // send all people
      res.json(
        await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
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