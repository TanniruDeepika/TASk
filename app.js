const dotenv=require('dotenv');
const express=require('express');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');

const app=express();
dotenv.config({path: './config.env'});
require('./db/conn');

const Users=require('./models/userSchema');
const Message=require('./models/msgSchema');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.get('/',(req,res)=>{
    res.send("hello world");
})

app.post('/register', async (req,res)=>{
    try{
        const username=req.body.username;
        const email=req.body.email;
        const password=req.body.password;

        const createUser=new Users({
            username:username,
            email:email,
            password:password
        });
        const created=await createUser.save();
        console.log(created);
        res.status(200).send("registered");
    }catch(error) {
res.status(400).send(error)
    }
})
app.post('/login', async (req,res)=>{
    try{
const email=req.body.email;
const password=req.body.password;
const user=await Users.findOne({email:email});
if(user){
    const isMatch=await bcryptjs.compare(password,user.password);
    if(isMatch){
        const token=await user.generateToken();
        res.cookie("jwt",token,{
            expires:new Date(Date.now() +8640000),
            httpOnly:true
        })
        res.status(200).send('LoggedIn')
    }else{
        res.status(400).send("Invalid credentials");
    }
}else{
        res.status(400).send("Invalid credentials")
    }

    }catch(error){
res.status(400).send(error);
    }
})
app.post('/message', async (req,res)=>{
    try{
        const name=req.body.name;
        const email=req.body.email;
        const message=req.body.message;

        const sendMsg=new Users({
            name:name,
            email:email,
            message:message
        });
        const created=await sendMsg.save();
        console.log(created);
        res.status(200).send("registered");
    }catch(error) {
res.status(400).send(sent)
    }
})
app.get('/logout',(req,res)=>{
    res.clearCookie("jwt",{path:'/'})
    res.status(200).send("user logged out")
})
app.listen(3001,()=>{
    console.log("server is a");
})