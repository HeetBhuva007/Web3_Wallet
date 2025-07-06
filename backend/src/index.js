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
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/user',authRouter)
app.use('/transaction',transactionRouter);
app.use('/wallet',walletRouter);
app.use('/account',accountRouter)



const connectionInitialization = async () => {
    try {
      await reddisClient.connect();
      console.log("Redis connected");
  
      await main();
      console.log("MongoDB connected");
  
      const PORT = process.env.PORT
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
  
    }
    catch(err){
        console.log("connection error...")
    }
  };
  
  connectionInitialization();