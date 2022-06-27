const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const validator=require('validator')
const jwt=require('jsonwebtoken');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid email")
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    picture:{
        type:String,
        required:false,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
},{
    timestamps:true
})

userSchema.methods.matchPassword=async function(enteredPassword){  //for each user
    const user=this
    return await bcrypt.compare(enteredPassword,user.password)
}

userSchema.methods.generateToken=async function(){  // for specific user generating token
    const user=this
    const token=jwt.sign({_id:user.id.toString()},process.env.JWT_SECRET,{
        expiresIn:"30d"
    })

    user.tokens=user.tokens.concat({token})
    await user.save()

    return token
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