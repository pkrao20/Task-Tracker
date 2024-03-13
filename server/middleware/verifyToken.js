const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    // console.log("reached here");
    try {
        let token = req.header("Authorization");
         
        if (!token) {
            return res.status(403).send("Access Denied");
        }
        
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log("verified token");
        next();
    } catch (err) {
        console.log("something wrong");
        res.status(500).json({ error: err.message });
    }
};
module.exports= {verifyToken};