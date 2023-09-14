const mongoose=require("mongoose")
require('dotenv').config()

const connection=mongoose.connect(process.env.URL,{

    useNewUrlParser: true,
      useUnifiedTopology: true,
})
.then(()=>{

    console.log("connection successfull")
})
.catch((err)=>{

    console.log("connection failed to db");
    console.log(err)
})

module.exports={connection}


