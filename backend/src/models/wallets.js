const mongoose=require('mongoose');
const { Schema } = mongoose;

const walletSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true,
    },
    encryptedSeed:{
        type:String,
        required:true
    }
},{
    timestamps:true
});



const Wallet = mongoose.model('wallet', walletSchema);
module.exports=Wallet;