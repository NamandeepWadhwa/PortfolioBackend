const mongoose = require('mongoose');
const schema=require('./schema');
const project=schema.mdoels.project;


module.exports.getProjects=function(){
  return new Promise((resolve,reject)=>{
    project.find().then((data)=>{
      resolve(data);
    }).catch((err)=>{
      reject(err);
    }); 
  })

}
module.exports.addProject=function(newProject){
  const project=new project(newProject);
return new Promise ((resolve,reject)=>{ 
  project.save().then((data)=>{
    resolve();
  }).catch((err)=>{
    reject(err);
  });

});
}
module.exports.deleteProject=function(id){
  return new Promise((resolve,reject)=>{
    project.deleteOne({_id:id}).then(()=>{
      resolve();
    }).catch((err)=>{
      reject(err);
    });
  });
}
module.exports.updateProject=function(id,updatedProject){
  return new Promise((resolve,reject)=>{
    project.updateOne({_id:id},updatedProject).then(()=>{
      resolve();
    }).catch((err)=>{
      reject(err);
    });
  });
}
module.exports.registerUser=function(newUer){
 return new Promise ((resolve,reject)=>{
   bcrypt.hash(newUser.passowrd,10).then(hash=>{
    newUser.password=hash;
    newUer.save().then(()=>{
      resolve("User"+newUser.username+"created successfully");
    })

   }).catch((err)=>{
    console.log(err);
    reject("There was an error creating the user"+err);
   }
   )
 })
};
module.exports.checkUser=function(userData){

  return new Promise ((resolve,reject)=>{
    users.findOne({userName:userData.username}).then((user)=>{
      if(user){
        bcrypt.compare(userData.password,user.password).then((res)=>{
          if(res){
            resolve("User"+userData.username+"logged in successfully");
          }else{
            reject("User"+userData.username+"not found");
          }
        }).catch((err)=>{
          reject("User"+userData.username+"not found");
        })
      }else{
        reject("User"+userData.username+"not found");
      }
    })  
  
  })

};