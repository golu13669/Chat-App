const express=require('express')
const { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup, invite } = require('../Controllers/chatController')
const {protect}=require('../Middleware/authMiddleware')

const router=express.Router()

router.route("/").post(protect,accessChat)
router.route("/").get(protect,fetchChat)
router.route("/group").post(protect,createGroupChat)
router.route("/rename").put(protect,renameGroup)
router.route("/groupAdd").put(protect,addToGroup)
router.route("/groupRemove").put(protect,removeFromGroup)
router.route("/invite").post(protect,invite);


module.exports=router