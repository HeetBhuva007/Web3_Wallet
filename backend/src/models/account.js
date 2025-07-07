const mongoose=require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        
    },
    walletId:{
        type: Schema.Types.ObjectId,
        ref: 'wallet',
        required: true,
        
    },
    publicKey:{
        type:String,
        required:true,
        unique: true
    },
    encryptedPrivateKey:{
        type:String,
        required:true
    },
    derivationIndex:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});



const Account = mongoose.model('account', accountSchema);
module.exports=Account;