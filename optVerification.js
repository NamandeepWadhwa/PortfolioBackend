const otpGenerator = require('otp-generator');
const schema=require('./schema');
const OTP=schema.mdoels.otp;
const otpsender=require('./mailSender');
const sendEmail=otpsender.sendEmail;

module.exports.getOtp=async (userName)=>{
 
  try{
    
    
      let otp=otpGenerator.generate(6,{upperCase:false,specialChars:false});
      let result = await OTP.findOne({ otp: otp });
      while(result){
        otp=otpGenerator.generate(6,{upperCase:false,specialChars:false});
      }
      result= await OTP.findOne({ otp: otp });
      const otpPayload={
        userName:userName,
        otp:otp
      }
      
      const otpbody=  new OTP(otpPayload);
     
      await otpbody.save();
      
      return otpbody;
     
     
    }
    catch(err){
      console.log(err);
      return err;
    }
  
}

module.exports.verifyOtp=function (userName, otp){
  return new Promise((resolve,reject)=>{
  
    OTP.findOne({userName:userName,otp:otp}).then((result)=>{
   
      if(result){
        resolve(true);
      }else{
        reject(false);
      }
    }).catch((err)=>{
      
      
      reject(err);
    })
  })
}