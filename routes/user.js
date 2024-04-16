const express=require('express');
const router=express.Router();
const usercontroller=require('../controllers/usercontroller');

//get all the course in user is enrolled
router.get('/all/:user_id',usercontroller.getAll);

//

module.exports=router;