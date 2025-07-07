const mongoose=require('mongoose');
require('dotenv').config();

async function main() {
    await mongoose.connect(process.env.DB_CONNECT_STRING,{
        
        ssl: true, // 🔐 explicitly enable SSL
      })
}

module.exports=main