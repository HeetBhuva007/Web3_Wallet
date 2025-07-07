const { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const Account=require('../models/account')
const CryptoJS =require( 'crypto-js');
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const getBalance=async(req,res)=>{
    try{
        const {pubKey}=req.params

        const publicKey = new PublicKey(pubKey);
        const balanceLamports = await connection.getBalance(publicKey, "confirmed");
        const balanceSol = balanceLamports / LAMPORTS_PER_SOL;

        const balance= parseFloat(balanceSol.toFixed(4));
        res.json({ publicKey, balanceInSOL: balance });

    }
    catch(err){
        res.json({message:res.message})
    }
}
const getPrivKey=async(req,res)=>{
    try{
        const { publicKey, password } = req.body;
        
        if (!publicKey || !password) {
            return res.status(400).json({ error: 'Public key and password are required' });
          }
         
        const account = await Account.findOne({ publicKey });
        if (!account) return res.status(404).json({ error: 'Account not found' });
       
        const encrypted = account.encryptedPrivateKey; // base64 string
        const decrypted = CryptoJS.AES.decrypt(encrypted, password);
        
        const privateKey = decrypted.toString(CryptoJS.enc.Utf8);

        if (!privateKey) return res.status(401).json({ error: 'Incorrect password' });

        return res.json({ privateKey });
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}
module.exports={getBalance,getPrivKey}