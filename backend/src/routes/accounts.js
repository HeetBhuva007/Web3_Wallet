const express=require('express');
const accountRouter=express.Router();
const userMiddleware=require('../middleware/userMiddle')
const {getBalance,getPrivKey}=require('../controllers/accountControl')

accountRouter.get('/getBalance/:pubKey',userMiddleware,getBalance)
accountRouter.post('/getPrivateKey',userMiddleware,getPrivKey)

module.exports=accountRouter