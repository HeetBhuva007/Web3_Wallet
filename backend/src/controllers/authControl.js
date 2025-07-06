const validate=require('../utils/validate')
const bcrypt=require('bcrypt')
const User=require('../models/user')
const redisClient=require('../config/redis')
const jwt=require('jsonwebtoken')

const register = async (req, res) => {
    try {
        
        
      // Validate input
      validate(req.body);
      
      const { userName, emailId, password } = req.body;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
    
      // Check if user already exists
      let user = await User.findOne({ emailId });
      
      if (user) {
        return res.status(400).json({ message: "User already exists and is verified. Please login." });
      }
      
      if (!user) {
        // Create user if doesn't exist
        user = await User.create({
          userName,
          emailId,
          password: hashedPassword
        });
      }
      const token = jwt.sign({_id:user._id,emailId:emailId},process.env.JWT_KEY,{expiresIn: 2*60*60})

        const reply={
            userName:user.userName,
            emailId:user.emailId,
            _id:user._id
        }

        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(200).json({
            user:reply,
            message:"Registered Successfully"
        })
      
    } catch (err) {
      console.error("Register Error:", err);
      res.status(400).json({ message: err.message || "Registration failed" });
    }
};

const login=async (req,res)=>{
    try{
        const {emailId,password}=req.body

        if(!emailId)
            throw new Error("Invalid Credentials e");
        if(!password)
            throw new Error("Invalid Credentials f");

        const user = await User.findOne({emailId});
        if(!user){
            res.status(401).json({
                user:reply,
                message:"Not registered user"
            })
        }
        
        const match= await bcrypt.compare(req.body.password,user.password);
        if(!match)
            throw new Error("Invalid Credentials");

        const token = jwt.sign({_id:user._id,emailId:emailId},process.env.JWT_KEY,{expiresIn: 60*60})

        const reply={
            userName:user.userName,
            emailId:user.emailId,
            _id:user._id
        }
        
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(200).json({
            user:reply,
            message:"Logged In Successfully"
        })

    }
    catch(err){
        res.status(401).send(err.message);
    }
}

const logout=async (req,res)=>{
    try{
    //validate token. this part is middleware so not done in this function. it is already checked


    //add token to redis database for blacklist
        const {token}=req.cookies;
        const payload=jwt.decode(token);

        await redisClient.set(`token:${token}`,"BLOCKED");
        await redisClient.expireAt(`token:${token}`,payload.exp)

        res.cookie("token",null,{expires:new Date(Date.now())})
        res.send("logged out successfully");

    }
    catch(err){
        res.status(503).send(err.message)
    }
}


module.exports={register,login,logout}