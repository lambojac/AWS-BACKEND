const mongoose=require("mongoose")
const schema=mongoose.Schema({
name:{
    type:String,
    required:true

},
age:{
    type:String,
    required:true
},
phoneNumber:{
    type:String,
    required:true
}

},{timestamps:true})

module.exports=mongoose.model("reg",schema)