const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
    try {
        //  check if the token is in the cookies
        const { token = false } = req.cookies;
        if(token) {
            // verify token
            const payload = await jwt.verify(token, process.env.SECRET);
            // add payload to request 
            req.payload = payload;
            // move on 
            next();

        } else {
            throw "Not Logged In";
        }
    } catch (error){
        res.satus(400).json({ error })
    }

}
module.exports = isLoggedIn;
