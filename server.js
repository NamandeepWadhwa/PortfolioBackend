const express=require('express');
const app=express();
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();
const cors=require('cors');
const otpVerification=require('./optVerification');
const mail = require('./mailSender');
const fileUpload=require('express-fileupload');
const project=require('./project');
const schema=require('./schema');
const user=require('./user');
const otpsender=require('./mailSender');
const jwt=require('jsonwebtoken');
const passport=require('passport');
const passportJWT=require('passport-jwt');
let ExtractJWT=passportJWT.ExtractJwt; 
const skills=require('./skills');
let JWTStrategy=passportJWT.Strategy;
let jwtOptions={
    jwtFromRequest:ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey:process.env.SECRET_KEY
};
let strategy=new JWTStrategy(jwtOptions,function (
    jwt_payload, next) {
       
        if(jwt_payload){
            next(null,{
                _id:jwt_payload._id,
                userName:jwt_payload.userName
            });
           
        } else{
            
            next(null,false);
          }
    }
);
passport.use(strategy);
app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use(fileUpload());

 const images=path.join(__dirname,'images/');
 const resumePath=path.join(__dirname,'resume/');


const HTTP_PORT=process.env.PORT || 8080;

app.get('/api/projects',(req,res)=>{
    project.getProjects().then((data)=>{
    
     
        res.status(200).json(data);
    }).catch((err)=>{
      
        res.status(500).json({error:err});
    });
});
app.get('/api/projects/:id',(req,res)=>{

    
   let id=req.params.id;
    project.getProjectById(id).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
     
        res.status(500).json({error:err});
    });
})
app.post('/api/projects',passport.authenticate('jwt', { session: false }),(req,res)=>{
    
    project.addProject(req.body).then((data)=>{

        
        res.status(200).json({project:data});
    }).catch((err)=>{
       
        res.status(500).json("Error while adding the project");
    });
});
app.delete('/api/projects/:id',passport.authenticate('jwt', { session: false }),(req,res)=>{
    console.log(req.params.id);
    project.deleteProject(req.params.id).then(()=>{
        res.json({message:"project deleted successfully"});
    }).catch((err)=>{
        res.status(500).json("Error while deleting the project");
    });
});
app.post('/api/projects/:id',passport.authenticate('jwt', { session: false }),(req,res)=>{
   
    project.updateProject(req.params.id,req.body).then(()=>{
       
        res.json({message:"project updated successfully"});
    }).catch((err)=>{
        
        res.status(500).json("Error while updating the project");
    });
});

app.post('/api/register',passport.authenticate('jwt', { session: false }),(req,res)=>{
user.registerUser(req.body).then(()=>{
    res.json({message:"user registered successfully"});
}).catch((err)=>{
    res.status(500).json({error:err});
});
})
app.post('/api/login',(req,res)=>{
    user.checkUser(req.body).then((data)=>{
        let payload={_id:data._id,userName:data.userName};
        let token=jwt.sign(payload,jwtOptions.secretOrKey);
        res.json({message:"user logged in successfully",userToken:token});
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
app.get('/api/getOtp/:userName',passport.authenticate('jwt', { session: false }),(req,res)=>{
    let params=req.params;
   
    
  
    otpVerification.getOtp(params.userName).then((otpPayload)=>{
        res.status(200).json({otp:otpPayload.otp});
    }).catch((err)=>{
        res.status(500).json({message:err});
    });
})

app.get('/api/verifyOtp/:userName/:otp/',passport.authenticate('jwt', { session: false }),(req,res)=>{
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
app.post('/api/upload/image',(req,res)=>{
   
   if(req.files===null || req.files===undefined){

         res.status(400).json("No files were uploaded");}
         else{
           
         
            let uniqueName=Date.now()+req.files.image.name;
                let image=req.files.image;
                image.mv('./images/'+uniqueName);
               return res.json({imageUrl:uniqueName});
         }
});

app.get('/api/images/:imageName',(req,res)=>{
    let imageName=req.params.imageName;
    let imagePtah=path.join(images+imageName);
   res.sendFile(imagePtah);
});


app.get('/api/skills',(req,res)=>{
    skills.getSkills().then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
})
app.post('/api/skills',passport.authenticate('jwt', { session: false }),(req,res)=>{

    skills.addSkill(req.body).then((data)=>{
        res.status(200).json({skill:data});
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});

app.post('/api/skills/:id',passport.authenticate('jwt', { session: false }),(req,res)=>{
    skills.updateSkill(req.params.id,req.body).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
});
app.delete('/api/skills/:id',passport.authenticate('jwt', { session: false }),(req,res)=>{
    skills.deleteSkill(req.params.id).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
});
app.get('/api/skills/:id',(req,res)=>{
    skills.getSkillById(req.params.id).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        res.status(500).json({error:err});
    });
})

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

