const mongoose=require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
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
    accountId:{
        type: Schema.Types.ObjectId,
        ref: 'account',
        required: true,
        
    },
    toAddress:{
        type:String,
        required:true
    },
    tokenMint:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    signature:{
        type:String,
        required:true,
        unique: true
    },
    status:{
        type:String,
        enum: ['pending', 'confirmed', 'failed'],
        default: 'pending'
    }
},{
    timestamps:true
});



const Transaction = mongoose.model('transaction', transactionSchema);
module.exports=Transaction;