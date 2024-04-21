const jwt = require("jsonwebtoken");
const constvar = require('../constantVariable/constant')
const verifyToken = (req,res,next)=>{
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers['authorization'];

    if(!token){
        return res.status(403).send({
            message : "A token is required for authentication",
            statusCode : 403
        });
    }

    try{
        let secret = constvar.constant_variable.token_secret
        let decode = jwt.verify(token,secret)
    }catch(err){
        return res.status(401).send({
            message : "Invalid Token",
            statusCode : 401
        });
    }
    return next();
}

module.exports = verifyToken;