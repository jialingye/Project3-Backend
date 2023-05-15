///Dependencies 
const express = require ('express');
const app = express ();
require("dotenv").config();
const {PORT,MONGODB_URL,SECRET} = process.env;
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("./models/connection");
const session = require('express-session');
const MongoStore = require('connect-mongo');

// middleWare
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: MONGODB_URL
        }),
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30
        }
    })
)

//router
const userRouter = require("./controllers/user");
const bookingRouter = require("./controllers/booking");

//route
app.get("/", (req,res)=> {
    res.send("hello world");
})

app.use("/user", userRouter);
app.use("/booking", bookingRouter);

//Listener
app.listen(PORT, () => console.log(`listening to PORT ${PORT}`));