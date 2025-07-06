const express=require('express');
const authRouter=express.Router();
const {register,login,logout}=require('../controllers/authControl')
const userMiddleware=require('../middleware/userMiddle')

authRouter.post('/register',register)

authRouter.post('/login',login)

authRouter.post('/logout',userMiddleware,logout)

authRouter.get('/check-auth',userMiddleware,(req,res)=>{
    const reply={
        userName:req.result.userName,
        emailId:req.result.emailId,
        _id:req.result._id
    }

    res.status(200).json({
        user:reply,
        message:"Valid user"
    })
})

module.exports=authRouter