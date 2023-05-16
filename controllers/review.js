// require dependencies
const express = require('express');
const Review = require('../models/review');

// initialize router
const router = express.Router();

// Create Route
router.post('/', async (req,res) => {

})

// Get all reviews
router.get('/', async (req, res) => {
    try {
      const reviews = await Review.find();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

router.get('/positive', async (req, res) => {

})

module.exports = router