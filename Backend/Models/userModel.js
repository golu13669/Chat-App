const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    picture:{
        type:String,
        required:true,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},{
    timestamps:true
})

userSchema.methods.matchPassword=async function(enteredPassword){  //for each user
    const user=this
    return await bcrypt.compare(enteredPassword,user.password)
}

userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        const salt=await bcrypt.genSalt(10)
        user.password=await bcrypt.hash(user.password,salt)
    }
    next()
})

const User=mongoose.model('User',userSchema)

module.exports=User