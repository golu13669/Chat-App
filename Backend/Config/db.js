const mongoose=require('mongoose')


const dbConnect=async()=>{
    try{
            mongoose.connect('mongodb://127.0.0.1:27017/Chat-Mern',{
            useNewUrlParser:true,
            useUnifiedTopology:true 
        })

        console.log(`MongoDB connected`.cyan)
    }
    catch(err){
        console.log(err)
        process.exit()
    }
}

module.exports=dbConnect
