const mongoose = require("mongoose");
// const Task = require('./task');

const userSchema = new mongoose.Schema({
    fName:{
        type:String,
        required: true,
    },
    lName:{
        type:String,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    tasks:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'task'
        }
    ],
    // array of tasks for a particular user
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
},{timestamps:true});

module.exports = mongoose.model('user',userSchema);