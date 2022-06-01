const express=require('express')
const {registerUser, authUser, allUsers, changePass, useremailAndpass, userEmailPass}=require('../Controllers/UserController');
const {protect} = require('../Middleware/authMiddleware');

const router=express.Router()

router.route('/').post(registerUser).get(protect,allUsers);
router.post('/login',authUser);


router.put('/changepass' ,protect,changePass);

//password forget through email
router.post('/userResetPass', useremailAndpass);
router.post('/user/reset/:id/:token' ,userEmailPass);

module.exports=router
