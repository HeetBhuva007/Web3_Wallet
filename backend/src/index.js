const express=require('express');
const app=express();
require('dotenv').config();
const main=require('./config/db')
const reddisClient=require('../src/config/redis');
const authRouter = require('./routes/userAuth');
const cookieParser = require('cookie-parser');
const transactionRouter = require('./routes/transactions');
const walletRouter = require('./routes/wallets');
const accountRouter = require('./routes/accounts');
const cors=require('cors')



app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'https://web3wallet-opal.vercel.app',
  credentials: true,
}));


app.use('/user',authRouter)
app.use('/transaction',transactionRouter);
app.use('/wallet',walletRouter);
app.use('/account',accountRouter)



const connectionInitialization = async () => {
    try {
      await reddisClient.connect();
      
  
      await main();
      console.log("✅ Redis and DB connected.");
  
      const PORT = process.env.PORT || 4001
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
  
    }
    catch(err){
        console.log("connection error...")
    }
  };
  
  connectionInitialization();