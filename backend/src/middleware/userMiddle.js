const jwt=require('jsonwebtoken')
require('dotenv').config();
const User=require("../models/user")
const reddisClient=require('../config/redis')

const userMiddleware=async (req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("Token is not present");
        }


        const payload=await jwt.verify(token,process.env.JWT_KEY);

        const {_id}=payload;
        if(!_id){
            throw new Error("Token is not present");
        }

        const result=await User.findOne({_id});
        if(!result){
            throw new Error("user is not present");
        }


        const IsBlocked=await reddisClient.exists(`token:${token}`);

        if(IsBlocked)
            throw new Error("Token expired")

        req.result=result;

        next();
    }
    catch(err){
        res.status(401).send(err.message);
    }

}

module.exports=userMiddleware;