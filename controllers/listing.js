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
    // send all listing
    res.json(await Listing.find({}));
    } catch (error) {
    //send error
    res.status(400).json(error);
    }
  });

// Listing SHOW ROUTE
router.get("/:id", async (req, res) => {
    try {
        res.json(await Listing.findById(req.params.id)).status(200);
    } catch (error) {
        res.status(400).json(error);
        console.log("error", error);
    }
});

// Listing POST ROUTE
router.post("/", async (req, res) => {
    try {
    res.json(await Listing.create(req.body));
    } catch (error) {
    res.status(400).json(error);
    }
});

// Listing UPDATE ROUTE
router.put("/:id", async (req, res) => {
    try {
    res.json(
        await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
    } catch (error) {
    res.status(400).json(error);
    }
});

// Listing DELETE ROUTE
router.delete("/:id", async (req, res) => {
    try {
    res.json(await Listing.findByIdAndRemove(req.params.id));
    } catch (error) {
    res.status(400).json(error);
    }
});


module.exports = router;