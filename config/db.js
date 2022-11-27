const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
//const db = 'mongodb://localhost:27017/local'

const connectDB = async () => {
  try {
    await mongoose.connect(db, 
      { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      });

    console.log('MongoDB connected...')
  } catch (error) {
    console.log('MongoDB connection is FAILED...')
    console.log(error.message);

    process.exit(1);
  }
}

module.exports = connectDB;