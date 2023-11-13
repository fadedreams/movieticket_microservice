import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  //if (!process.env.JWT_KEY) {
  //throw new Error('JWT_KEY must be defined');
  //}

  try {
    //await mongoose.connect('mongodb://orders-mongo-srv:27017/auth', {
    await mongoose.connect('mongodb://localhost:27017/orders', {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      //useCreateIndex: true
    });
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3002, () => {
    console.log('Listening on port 3002!!!!!!!!');
  });
};

start();
