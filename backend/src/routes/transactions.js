const express=require('express');
const transactionRouter=express.Router();
const userMiddleware=require('../middleware/userMiddle')
const {airDrop, sendSol}=require('../controllers/transactionControl')


transactionRouter.get('/airdrop/:pubKey',userMiddleware,airDrop)
transactionRouter.post('/sendSol',userMiddleware,sendSol)

module.exports=transactionRouter