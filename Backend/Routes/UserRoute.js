const express=require('express')
const {registerUser, authUser, allUsers, changePass, UseremailCheck, Userforgetpass}=require('../Controllers/UserController');
const {protect} = require('../Middleware/authMiddleware');

const router=express.Router()

router.route('/').post(registerUser).get(protect,allUsers);
router.post('/login',authUser);


router.put('/changepass' ,protect,changePass);

//password forget through email
router.post('/userResetPass', UseremailCheck);
router.post('/reset/:id/:token' ,Userforgetpass);

module.exports=router
