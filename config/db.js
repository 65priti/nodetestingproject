const mongoose = require("mongoose");

const mongooseDbConnect = async () => {
  try {
   const connectM = await mongoose.connect(process.env.MONGO_URI);
   console.log('connected successfully')

  } catch(error) {
console.log(error.message)
  }
};

module.exports = mongooseDbConnect;