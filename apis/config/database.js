// Import MongoDB  => mongoose is package(library) of MongoDB
const mongoose = require('mongoose');


// Connection URI
const uri = process.env.DB_CONNECTION;

try {
  //Connect DB to the database by Mongoose
  mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected!'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
  });
} catch (error) {
  console.log(error);
}