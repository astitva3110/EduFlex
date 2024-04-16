const express=require('express');
const router=express.Router();
const authcontroller=require('../controllers/authcontroller');


router.get('/register',authcontroller.getRegister);

router.post('/register',authcontroller.postRegister);

router.get('/login',authcontroller.getLogin);

router.post('/login',authcontroller.postLogin);

router.post('/otp',authcontroller.checkOTP);

router.post('/otp',authcontroller.postResetOtp)

router.get('/reset',authcontroller.getReset);

router.post('/reset',authcontroller.postReset)

module.exports=router;