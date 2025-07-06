const mongoose=require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        immutable:true,
        trim:true
    },
    password:{
        required:true,
        type:String,
    }
},{
    timestamps:true
});



const User = mongoose.model('user', userSchema);
module.exports=User;