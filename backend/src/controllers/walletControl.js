const Account = require("../models/account");
const Wallet = require("../models/wallets");
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const { Keypair,Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const CryptoJS = require('crypto-js');
const bs58 = require('bs58');

const connection = new Connection(process.env.RPC_URL, "confirmed");

const airdropSolToAccount = async (publicKeyBase58) => {
    const publicKey = new PublicKey(publicKeyBase58);
  
    try {
        
      const sig = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
      
      
      return sig;
    } catch (err) {
        
      throw new Error(`Airdrop failed: ${err.message}`);
    }
}



const createWallet=async(req,res)=>{
    try{
        const userId=req.result._id;
        const {encryptedSeed}=req.body

        const existing=await Wallet.findOne({userId});
        if(existing){
            res.json({message:"user already exist"});
        }

        const newWallet=await Wallet.create({
            userId,
            encryptedSeed
        })

        res.json({
            wallet:newWallet,
            message:"Wallet created successfully",
        })
    }
    catch(err){
        res.json({message:err.message});
    }
}

const getWallet=async(req,res)=>{
    try{
        const userId=req.result._id;

        const wallet=await Wallet.findOne({userId});

        if (!wallet) {
            return res.status(404).json({ message: "No wallet found" });
          }

        res.json({
            wallet
        })
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}


const createAccount=async(req,res)=>{
    try{
        const {walletId,password}=req.body;
        const userId=req.result._id

        const wallet = await Wallet.findOne({ _id: walletId, userId });
        if (!wallet || !wallet.encryptedSeed) {
        return res.status(400).json({ message: "Wallet not found or missing seed" });
        }
       

        const decryptedMnemonic = CryptoJS.AES.decrypt(wallet.encryptedSeed, password).toString(CryptoJS.enc.Utf8);
        

        const lastAccount = await Account.find({ walletId }).sort({ derivationIndex: -1 }).limit(1);
        const derivationIndex = lastAccount.length > 0 ? lastAccount[0].derivationIndex + 1 : 0;
        
        const seed = await bip39.mnemonicToSeed(decryptedMnemonic);
        const path = `m/44'/501'/${derivationIndex}'/0'`;
        const { key } = derivePath(path, seed.toString("hex"));

        const keypair = Keypair.fromSeed(key);
        const publicKey = keypair.publicKey.toBase58();
        const secretKey = bs58.encode(keypair.secretKey);

        const encryptedPrivateKey = CryptoJS.AES.encrypt(secretKey, password).toString();
        
        const account = await Account.create({
            userId,
            walletId,
            publicKey,
            encryptedPrivateKey,
            derivationIndex
        });
        

        await airdropSolToAccount(publicKey);

        res.json({
            account:account,
            message:"Account created successfully"
        })
    }
    catch(err){
        res.json({message:err.message})
    }
}

const getAllAccounts=async(req,res)=>{
    try{
        const userId=req.result._id;

        const accounts=await Account.find({userId:userId});


        res.json({
            accounts:accounts
        })
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

module.exports={createWallet,createAccount,getWallet,getAllAccounts,airdropSolToAccount}