const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const schema=require('./schema');
const users=schema.mdoels.users;

module.exports.registerUser=function(newUser){

  return new Promise ((resolve,reject)=>{
    bcrypt.hash(newUser.password,10).then(hash=>{
    
     newUser.password=hash;
     
     let user=new users(newUser);
  
   
     
     user.save().then(()=>
     {
       resolve("User"+newUser.userName+"created successfully")
     }).catch((err)=>{
          reject("There was an error creating the user"+err);
        
       }); 
 
    }).catch((err)=>{
     console.log(err);
     reject("There was an error creating the user"+err);
    }
    )
  })
 };
 module.exports.checkUser=function(userData){

 
   return new Promise ((resolve,reject)=>{
     users.findOne({userName:userData.userName}).then((user)=>{
       if(user){
         bcrypt.compare(userData.password,user.password).then((res)=>{
           if(res){
           
             resolve(user);
           }else{
             reject("User "+userData.userName+"not found");
           }
         }).catch((err)=>{
           reject("User "+userData.userName+"not found");
         })
       }else{
         reject("User "+userData.userName+"not found");
       }
     })  
   
   })
 
 };
module.exports.getUser=function(userName){
  return new Promise((resolve,reject)=>{
    users.find({userName:userName}).then((data)=>{
      resolve(data);
    }).catch((err)=>{
      reject(err);
    });
  } )
}