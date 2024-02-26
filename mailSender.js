const emailjs = require('@emailjs/nodejs');

module.exports.sendEmail = async (from_name,message)=>{
  const templateParams={
    from_name:from_name,
    message:message
  };
  emailjs.send(process.env.SERVICE_ID,process.env.TEMPLATE_ID,templateParams,{publicKey:process.env.PUBLIC_KEY,privateKey:process.env.PRIVATE_KEY}).then((result)=>{return result }).catch((err)=>{console.log(err)});
}