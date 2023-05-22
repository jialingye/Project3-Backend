const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
require("dotenv").config();
const {SALT,SECRET} = process.env;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const jwt = require('jsonwebtoken');
let failedLogin;


//login post route
router.post('/login', async(req, res, next) => {
    try {
        let user;
        //find user exist
        const userExists = await User.exists({email: req.body.email});
        console.log(userExists)
        
        //if exists, find the one in mongodb
        if(userExists) {
            user = await User.findOne({email: req.body.email});
        } else {
            failedLogin = "Your username or password didn't match"
            return res.status(401).json({error: failedLogin });
        }
        //if user match, compare password
        const match = await bcrypt.compare(req.body.password, user.password);
        //if password match, then create session
        if(match) {
            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username,
                },
                SECRET
            );
            req.session.currentUser = {
                id: user._id,
                username: user.username
            };
            
           res.json({token, currentUser: req.session.currentUser})
        } else {
            failedLogin = "Your username or password didn't match"
            res.status(401).json({ error: failedLogin });
        }
    } catch(err) {
        console.log(err);
        next();
    }
})

//sign up route

router.get('/signup', (req, res) => {
    res.send("sign up");
});

router.post('/signup', async(req, res, next) => {
    try {
        //creat user and rounds of salt
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
          };
        //create hash on user password depends on SALT number
        const rounds = SALT;
        const salt = await bcrypt.genSalt(parseInt(rounds));
        const hash = await bcrypt.hash(newUser.password, salt);

        newUser.password = hash;
        
        //if user not already exist, create user
        const existUser = await User.findOne({email: newUser.email});
        if(existUser){
             res.status(400).json({error: 'Email already exists'})
        } else {
            await User.create(newUser);
            res.status(200).json({ message: 'User created successfully' });
        }
    } catch(err) {
        console.log(err);
        next();
    }
})
// //logout page
router.get('/validation', (req, res) => {
   try {
    // get token from header
    const token = req.headers.authorization.split(' ')[1];
    // verify token
    const decoded = jwt.verify(token, SECRET);
    //send response back to front end
    res.json({valid: true, user: decoded});
    } catch (error) {
    res.json({valid: false});
    }
  });

//logout page
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ error: 'Server error' });
      } else {
        res.clearCookie('token'); // Clear the token cookie
        res.json({ message: 'Logout successful' });
      }
    });
  });

//user and host profile page
router.get('/:id', async(req, res, next) => {
    try{
        let userId = req.params.id;

        const user = await User.findById(userId)
        .populate('listing')
        .populate('bookings')
        .populate('review');

        res.json(user)
    }catch (err){
        console.log(err);
    }
})

//user and host profile page
router.put('/:id', async(req, res, next) => {
    try{
         // user update
         res.json(
            await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
          );
    }catch (err){
        console.log(err);
    }
})

module.exports = router;