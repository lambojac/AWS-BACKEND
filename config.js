const mongoose = require("mongoose");

const connectToDb=(req,res)=>{
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("connected successfully to mongodb");
  })
  .catch((error) => {
    console.log("connection failed");
  });
}

  module.exports= {connectToDb}
