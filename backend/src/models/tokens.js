const mongoose=require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    mintAddress:{
        type:String,
        require:true,
        unique: true
    },
    symbol:{
        type:String
    },
    name:{
        type:String
    },
    decimals:{
        type:Number
    },
    initialSupply:{
        type:Number
    }
    

},{
    timestamps:true
});


const TokenSchema = mongoose.model('token', tokenSchema);
module.exports=TokenSchema;