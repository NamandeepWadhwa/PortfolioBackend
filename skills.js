const { resolve } = require('path');
const schema = require('./schema');
const skills = schema.mdoels.skills;

module.exports.getSkills=async function(){
  return new Promise((resolve,reject)=>
  {
    skills.find().then((data)=>{
      let category={};
     
      data.forEach((skill)=>{
      
      
        if(category[skill.category]===undefined){
          
          
          category[skill.category]=[];
          category[skill.category].push(skill);
         
        }
        else{
          category[skill.category].push(skill);
        }
      }
      );
     
      resolve(category);
      })
  
   
    }).catch((err)=>{
      console.log(err);
      reject(err);
    });
  
}
module.exports.addSkill=async function(newSkill){
  const addNewSkill =new skills({
    skill:newSkill.skill,
    category:newSkill.category,
    imageUrl:newSkill.imageUrl
  });
  return new Promise((resolve,reject)=>{
    addNewSkill.save().then((data)=>{
      resolve(data);
    }).catch((err)=>{
      reject(err);
    });
  });
}

module.exports.deleteSkill=async function(id){
  return new Promise((resolve,reject)=>{
    skills.deleteOne({_id:id}).then(()=>{
      console.log("deleted");
      resolve(true);
    }).catch((err)=>{
      reject(err);
    });
  });
}

module.exports.updateSkill=async function(id,updatedSkill){
return new Promise((resolve,reject)=>{
  skills.updateOne({_id:id},{
    skill:updatedSkill.skill,
    category:updatedSkill.category,
    imageUrl:updatedSkill.imageUrl
  }).then((data)=>{
    resolve(data);
  }).catch((err)=>{
    reject(err);
  })
})   

}
module.exports.getSkillById=async function(id){
  return new Promise((resolve,reject)=>{
    skills.findOne({_id:id}).then((data)=>{
      resolve(data);
    }).catch((err)=>{
      reject(err);
    });
  });
}