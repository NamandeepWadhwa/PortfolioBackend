const express=require('express');
const app=express();
const dotenv = require("dotenv");
dotenv.config();
const cors=require('cors');
const otpVerification=require('./optVerification');
const mail = require('./mailSender');
app.use(cors());
app.use(express.json());
const project=require('./project');
const schema=require('./schema');
const user=require('./user');
const otpsender=require('./mailSender');
const sendEmail=otpsender.sendEmail;
const HTTP_PORT=process.env.PORT || 8080;

app.get('/api/projects',(req,res)=>{
    project.getProjects().then((data)=>{
     
        res.json(data);
    }).catch((err)=>{
      console.log(err);
        res.status(500).json({error:err});
    });
});
app.post('/api/projects',(req,res)=>{
    project.addProject(req.body).then(()=>{
        res.json({message:"project added successfully"});
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
});
app.delete('/api/projects/:id',(req,res)=>{
    project.deleteProject(req.params.id).then(()=>{
        res.json({message:"project deleted successfully"});
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
});
app.put('/api/projects/:id',(req,res)=>{
    project.updateProject(req.params.title,req.body).then(()=>{
        res.json({message:"project updated successfully"});
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
});

app.post('/api/register',(req,res)=>{
user.registerUser(req.body).then(()=>{
    res.json({message:"user registered successfully"});
}).catch((err)=>{
    res.status(500).json({error:err});
});
})
app.post('/api/login',(req,res)=>{
    user.checkUser(req.body).then((data)=>{
        res.json({message:"user logged in successfully",dataUser:data});
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
    })
app.get('/api/users/:userName',(req,res)=>{
    let params=req.params;
 
    user.getUser(params.userName).then((data)=>{
     
        res.json(data);
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
})
app.get('/api/getOtp/:userName',(req,res)=>{
    let params=req.params;
    console.log(req.params);
    
  
    otpVerification.getOtp(params.userName).then((otpPayload)=>{
        res.status(200).json({otp:otpPayload.otp});
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
})

app.get('/api/verifyOtp/:userName/:otp/',(req,res)=>{
    let params=req.params;
    
   
    otpVerification.verifyOtp(params.userName,params.otp).then((result)=>{
        res.status(200).json({result:result});
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
});
app.put('/api/sendEmail/',(req,res)=>{
    let params=req.body;
    
    mail.sendEmail(params.from_name,params.message).then((result)=>{
        res.status(200).json({result:result});
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
});
app.use((req,res)=>{
    res.status(404).send("Page not found");
});



schema.connect().then(() => {
    app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) },);
   
})
.catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
});

