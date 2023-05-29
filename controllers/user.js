
const express = require('express');

const router = express.Router();
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const mongoose = require('mongoose');

require("dotenv").config();

const {SALT} = process.env;
const session = require('express-session');
const MongoStore = require('connect-mongo');
let failedLogin;

// signup post
router.post('/signup', async (req, res) => {
    try {
        //hashing password
        req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));

        // generate the user
        const user = await User.create(req.body);

        // response
        res.json({status: "User Created"});

    } catch (error){
        res.status(400).json({error})
    }

})
//login post route
router.post('/login', async (req, res) => {
    try{ 
        
        const {username, password } = req.body
        // get the user 
        
        const user = await User.findOne({username});

        if ( user ) {
            
            console.log(user)
            console.log(password, user.password)
            const passwordCheck = await bcrypt.compare(password, user.password)

            if(passwordCheck){ // is `passwordCheck` is True 
                
                const payload = { username } 
                // fetches logged in user's name each time they send a request. 
                // creating a token    payload is first argument
                //                     |________________________|
                //                           |     |  SECRET is second argument
                //                           |     |  |_______________________|
                //                           |     |  |                 | 
                const token = await jwt.sign(payload, process.env.SECRET);
                
                /*  
                *   1: Create cookie `res.cookie()`
                *   2: the first param option is the name of the cookie, `res.cookie('nameOfCookie')`
                *   3: the second option is the `value` of the cookie, we're going to pass the `token` variable `res.cookie('token', token)`
                *   4: and for the forth option we're going to set is {httpOnly: true} this is so the frontend cannot touch the cookie for secruity purposes. `res.cookie('token',token, {httpOnly: true})`
                * 

                 */
                res.cookie('token', token, {httpOnly: true}).json({payload, status: "logged in"})
            } else {
                res.status(400).json({error:"Password does not match"})
            }
        }  else {   // `user` will be undefined if the {useranme} you're searching for doesnt exist 
            res.status(400).json({error: "❌❌User🙅‍♀️🙅‍♂️ doesn't 🕳️ exist❕❌❌"})
        }
        res.send("log in");
    } catch (error) {

    }
});

// logout post
router.post('/logout', async (req, res) => {
    // res.clearCookie('NameOfCookie') will destroy the name of the cookie you pass into it, destroying the cookie logs the user out
    // .json is just sending a response back letting the user know they're logged out. 
    res.clearCookie('token').json({response: ' You are Logged Out ' }); 
})



module.exports = router;