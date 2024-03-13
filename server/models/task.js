const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    // count: {
    //     type: Number,
    // },
    status:{
        type:String,
        default:"Pending",
    },
    dueDate:{
        type:Date,
        required:true,
    }, 
},{timestamps:true});


module.exports = mongoose.model('task',taskSchema);