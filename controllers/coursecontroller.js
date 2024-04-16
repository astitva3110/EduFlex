const express=require('express');
const router=express.Router();
const { Resend } =require('resend');
require('dotenv').config();

const resend = new Resend(process.env.Resend);


