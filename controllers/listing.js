const express = require('express');
const Listing = require('../models/listing')

const router = express.Router();

router.get('/',  async (req,res) => {
    
    try {
        const listing = await Listing.find().lean();
        res.json(listing)
        
    } catch (error) {
        console.log(error);
    }

})



module.exports = router;
