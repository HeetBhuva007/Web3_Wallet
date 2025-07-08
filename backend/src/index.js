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
  origin: ['https://web3wallet-opal.vercel.app','http://localhost:5173'],
  credentials: true,
}));

app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});


app.use('/user',authRouter)
app.use('/transaction',transactionRouter);
app.use('/wallet',walletRouter);
app.use('/account',accountRouter)



const connectionInitialization = async () => {
    try {
      await reddisClient.connect();
      
  
      await main();
      
  
      const PORT = process.env.PORT || 4001
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        setInterval(() => {
            axios.get('https://web3-wallet-6s17.onrender.com/health')
                .then(res => {
                    console.log(`Health check successful`);
                })
                .catch(err => {
                    console.error(`Health check failed`);
                });
        }, 8 * 60 * 1000);
      });
  
    }
    catch(err){
        console.log("connection error...")
    }
  };
  
  connectionInitialization();
