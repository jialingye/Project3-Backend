const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
require("dotenv").config();
const {SALT} = process.env;
const session = require('express-session');
const MongoStore = require('connect-mongo');
let failedLogin;

//user profile page
router.get('/:id', async(req, res, next) => {
    try{
        let userId = req.params.id;

        const user = await User.findById(userId)
        .populate('listing')
        .populate('bookings');

        res.json(user)
    }catch (err){
        console.log(err);
    }
})


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
            return res.redirect('/user/login');
        }
        //if user match, compare password
        const match = await bcrypt.compare(req.body.password, user.password);
        //if password match, then create session
        if(match) {
            req.session.currentUser = {
                id: user._id,
                username: user.username
            };
            
           res.json(req.session.currentUser)
        } else {
            failedLogin = "Your username or password didn't match"
            res.redirect('/login');
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
        //creat hash on user password depends on SALT number
        const rounds = SALT;
        const salt = await bcrypt.genSalt(parseInt(rounds));
        const hash = await bcrypt.hash(newUser.password, salt);

        newUser.password = hash;
        
        //if user not already exist, create user
        const existUser = await User.findOne({email: newUser.email});
        if(existUser){
             res.status(400).json({error: 'Email already exists'})
        } else {
            const user = await User.create(newUser);
            res.json(user);
        }
    } catch(err) {
        console.log(err);
        next();
    }
})


//logout page
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;