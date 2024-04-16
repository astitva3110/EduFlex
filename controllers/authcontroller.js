const  client = require('../util/database');
const user=require('../models/user');
const bcrypt = require("bcrypt");
const { Resend } =require('resend');
const { query } = require('express');
const jwt=require('jsonwebtoken');
require('dotenv').config();

const resend = new Resend(process.env.Resend);

// funtion of password valiadtion
function validatePassword(password) {

  
  // Regular expression to match at least one special character
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  // Regular expression to match at least one digit
  const numberRegex = /\d+/;


  const hasSpecialChar = specialCharRegex.test(password);
  const hasNumber = numberRegex.test(password);

 
  return hasSpecialChar && hasNumber;
}

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};


async function sendEmailWithOTP(email, otp) {
  try {
    // Replace 'onboarding@resend.dev' with your sender email address
    await resend.emails.send({
      from: process.env.fromEmail,
      to: email,
      subject: 'Your OTP for Verification',
      html: `<p>Your One-Time Password (OTP) for verification is:<strong>${otp}</strong></p>`
    });
    console.log("Email sent successfully to", email);
    return true; 
  } catch (error) {
    console.error("Error sending email:", error);
    return false; 
  }
}


  //get request for register page
   exports.getRegister=async(req,res)=>{
      const query='select * from users'
     try {
    
        const resu = await client.query(query);
        res.status(200).json(resu.rows);
     } catch (err) {
    console.log(err.stack);
    } 
  
  }



//Post request to register the new user
exports.postRegister=async(req,res)=>{
  const {username,email,password}=req.body;
  const query='INSERT INTO users (username, email, password,otp) VALUES ($1,$2,$3,$4)';
  try{

    // check for user is already registered 
     const isexitquery ='select * from users where email=$1'
     const isexit=await client.query(isexitquery,[email]);

     if(isexit.rows.length > 0){
      res.status(500).json({message:"user is already exits"})
     }

     //validation of user data
     if(!username || !password){
      res.status(404).json({message:"Something is missing!!"});
     }

     const validpassword=validatePassword(password);
     if(!validpassword){
      res.status(500).json({message:"Password is not strong"});
     }
     
     //hashpassword
     const salt=await bcrypt.genSalt(10);
     const hasspassword=await bcrypt.hash(req.body.password,salt);


     //Genrate the otp
     const otp = generateVerificationCode();
     sendEmailWithOTP(email,otp);

     //Insertion of new user
     await client.query(query,[username,email,hasspassword,otp]);
     res.status(200).json({message:"User is registered"});


    //  const serach_query='SELECT id FROM users WHERE email=$1';
    //  const result=await client.query(serach_query,[email]);
    //  const id=result.rows[0];
    //  const token=jwt.sign({_id:id},process.env.JWT_KEY,{expiresIn:process.env.JWT_EXPIRE})
    //   res.cookie("token",token);
  }
  catch (err) {
    console.log(err.stack);
    res.status(500).json({message:"Internal Server Error"});
} 

}



//Sending the otp to the user email

exports.checkOTP=async(req,res)=>{
  const {email,otp}=req.body;
   try{
      const query='SELECT otp ,id FROM users WHERE email=$1'
      const result =await client.query(query,[email]);
      const {id,otp:user_otp}=result.rows[0];

      //checking the otp
      if(otp===user_otp){
        const update_query='UPDATE users SET verify = $1 WHERE email = $2'
        await client.query(update_query,[true,email])
        res.status(200).json({message:"User is verified"});
        const token=jwt.sign({_id:id},process.env.JWT_KEY,{expiresIn:process.env.JWT_EXPIRE})
        res.cookie("token",token)
      }
      
      res.status(500).json({message:"otp doesnot match"});
   }
   catch (err) {

    console.error("Error sending email:", err);
    res.status(500).json({message:"Internal Server Error"});
} 
}





// get request for login page
exports.getLogin=(req,res)=>{
  res.send("Login page");
}



//post request for login
exports.postLogin=async(req,res)=>{
  const {email,password}=req.body;
  const query='Select id,email,password from users where email=$1';
  
  try{
  // Searching the user creditials
  const result=await client.query(query,[email]);
  const { id, email: user_email, password: user_password } = result.rows[0];
 
  //checking email exit 
  if(!user_email){
    res.status(404).json({message:"User is not found"});
  }

  //compare the passoword for login
  const compare_password=await bcrypt.compare(password,user_password);
  if(compare_password){
    const token=jwt.sign({_id:id},process.env.JWT_KEY,{expiresIn:process.env.JWT_EXPIRE})
        res.cookie("token",token)
    
    res.status(200).json({message:"Use is Logged in "});
  }
  else{
    req.status(500).json({message:"Password is incorrect"});
  }
  }

  catch (err) {
    console.log(err.stack);
    res.status(500).json({message:"Internal Server Error"});
  }
}

exports.postResetOtp=async(req,res)=>{
  const {email}=req.body;
  const otp = generateVerificationCode();
  sendEmailWithOTP(email,otp);

  //reset the otp in the database
  const update_query='UPDATE users SET verify = $1 WHERE email = $2'
  const upadte_otp='UPDATE users SET verify = $1 WHERE email = $2'
  await client.query(update_query,[false,email])
  await client.query(upadte_otp,[otp,email])

  res.status(200).json({message:'Request for the password reset'})
  res.redirect('/otp');

}

//get requset to get the reset page
exports.getReset=(req,res)=>{
  res.render('Reset page');
}



//post request to reset the password
exports.postReset=async(req,res)=>{
   const {confirm_password,password}=req.body;
   const {userId}=req.params.user_id;
   
 try{
  if(confirm_password!=password){
    res.status(500).json({message:"Confrim password and password must be same"});
   }
   

   //bcrypt of a password
   const salt=await bcrypt.genSalt(10);
   const hasspassword=await bcrypt.hash(req.body.password,salt);

   const query='UPDATE users SET password = $1 WHERE id = $2';
   await client.query(query,[hasspassword,userId])
   res.status(200).json({message:"Password is updated"});
}
catch (err) {
  console.error(err);
  res.status(500).json({message:"Internal Server Error"});
}
 }