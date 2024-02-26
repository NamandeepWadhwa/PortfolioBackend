const mongoose = require('mongoose');
const mailSender = require('./mailSender');
const userSchema=new mongoose.Schema({
  userName:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  }


})

const projectSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true,
    unique:true
  },
  description:{
    type:String,
    required:true
  },
  imageUrl:{
    type:[String],
    required:true
  },
  link:{
    type:String,
    required:true
  }
})
const optSchema=new mongoose.Schema({
  
  userName:{
    type:String,
    required:true,
   
  },
  otp:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now,
    expires:600
  } 
})

let project=mongoose.model('project',projectSchema);
let users=mongoose.model('user',userSchema);
let otp=mongoose.model('otp',optSchema);


 

module.exports.connect=function(){
  let mongoDBConnectionString=process.env.MONGODB_URL;
  return mongoose.connect(mongoDBConnectionString).then(()=>{
    console.log("Connected to MongoDB");
  }).catch((err)=>{
    
   reject(err);
  });
}
module.exports.mdoels={
  users,
  project,
  otp,
}
