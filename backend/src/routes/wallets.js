const express=require('express');
const walletRouter=express.Router();
const userMiddleware=require('../middleware/userMiddle')
const {createWallet,createAccount, getWallet, getAllAccounts}=require('../controllers/walletControl')

walletRouter.post('/createWallet',userMiddleware,createWallet);
walletRouter.post('/createAccount',userMiddleware,createAccount);
walletRouter.get('/getWallet',userMiddleware,getWallet);
walletRouter.get('/getAllAccount',userMiddleware,getAllAccounts);


module.exports=walletRouter