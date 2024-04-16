const express =require('express');
const createTable=require('./models/course')
const cookieParser = require('cookie-parser');
const app=express();
require('dotenv').config();
const PORT=process.env.PORT||3000;
const {client}=require('./util/database');
const authroutes=require('./routes/auth');
const userroutes=require('./routes/user');
const courseroute=require('./routes/course');

app.use(express.json());
app.use(cookieParser());
app.use('/user',userroutes);
app.use('/auth',authroutes);
app.use('/course',courseroute);
app.get('/',(req,res)=>{
    res.render('home page');
})


app.listen(PORT,(req,res)=>{
    console.log("SERVER ID CONNECTED");
})