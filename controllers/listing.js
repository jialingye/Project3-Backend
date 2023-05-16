////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Listing = require("../models/listing");
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
      // send all people
      res.json(await Listing.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

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
      // send all people
      res.json(await Listing.create(req.body));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // LISTING UPDATE ROUTE
  router.put("/:id", async (req, res) => {
    try {
      // send all people
      res.json(
        await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // LISTING DELETE ROUTE
  router.delete("/:id", async (req, res) => {
    try {
      // send all people
      res.json(await Listing.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

  module.exports = router;