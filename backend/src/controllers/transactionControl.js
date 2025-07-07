const {airdropSolToAccount}=require('../controllers/walletControl')
const Account = require("../models/account");
const bs58 = require("bs58");
const CryptoJS = require("crypto-js");

const transactions=require('../models/transaction')

const { Keypair, Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');


const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
async function getSolBalance(publicKeyStr) {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const publicKey = new PublicKey(publicKeyStr);

  const balanceLamports = await connection.getBalance(publicKey);
  const balanceSol = balanceLamports / LAMPORTS_PER_SOL;

  return balanceSol;
}

const airDrop=async(req,res)=>{
    try{
        const txSig = await airdropSolToAccount(req.params.pubKey);
        res.json({ message: "Airdropped 1 SOL", txSig });
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}


const sendSol=async(req,res)=>{
    try{
        const { accountId, password, toAddress, amount } = req.body;
        const userId = req.result._id;

        const account = await Account.findOne({ _id: accountId, userId });
        if (!account) {
        return res.status(404).json({ message: "Account not found" });
        }
       
        const decryptedSecretKeyBase58 = CryptoJS.AES.decrypt(
        account.encryptedPrivateKey,
        password
        ).toString(CryptoJS.enc.Utf8);
       

        if (!decryptedSecretKeyBase58) {
            return res.status(401).json({ message: "Incorrect password or corrupted key" });
          }
          
          const secretKey = bs58.decode(decryptedSecretKeyBase58);
          const senderKeypair = Keypair.fromSecretKey(secretKey);
          
          const balanceLamports = await connection.getBalance(senderKeypair.publicKey);
          const balanceSol = balanceLamports / LAMPORTS_PER_SOL;
          
          if (balanceSol < parseFloat(amount)) {
                  return res.status(400).json({ message: "Insufficient balance" });
          }
          

          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: senderKeypair.publicKey,
              toPubkey: new PublicKey(toAddress),
              lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
            })
          );
          
          const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
         
          await transactions.create({
            userId,
            walletId: account.walletId,
            accountId: account._id,
            toAddress,
            tokenMint: "SOL",
            amount: parseFloat(amount),
            signature,
            status: "confirmed",
          });

        res.json({
        message: "Transaction successful",
        signature
        });
    }
    catch(err){
      
        res.json({message:err.message})
    }
}


module.exports={airDrop,sendSol}