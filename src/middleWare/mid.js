const jwt = require("jsonwebtoken");

const authorAuth = async function ( req, res, next) {
    try{
        let token = (req.headers["x-api-key"]); 

        if(!token){
            return res.status(403).send({status: false, message : "Missing authentication token in request"});
        }

        let decodedToken = await jwt.verify(token, "functionup-uranium");

        if (!decodedToken){
            return res.status(400).send({ status: false, msg: "Invalid authentication token in request"});
        } 
        req["authorId"] = decodedToken.authorId;
        next();
    }
    catch(error){
        console.error(`Error! ${error.message}`)
        res.status(500).send({ status : false, message: error.message});
    }
}


module.exports.authorAuth = authorAuth;