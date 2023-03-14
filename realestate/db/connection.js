import mongoose from 'mongoose';

const connection = mongoose.connect('mongodb://localhost:27017/harryPotter', {useNewUrlParser: true,
useUnifiedTopology: true})

mongoose.connection.on('connected', () => {
    console.log("Mongoose succesfully connected to DB server");
  })

  mongoose.connection.on('disconnected', () => {
    console.log("Mongoose succesfully disconnected from DB server");
  })

export default connection