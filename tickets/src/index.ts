import mongoose from 'mongoose';

import { app } from './app';

import { RabbitMQService } from "./utils";
const rabbitService = new RabbitMQService();

const start = async () => {
  //if (!process.env.JWT_KEY) {
  //throw new Error('JWT_KEY must be defined');
  //}

  try {
    //await mongoose.connect('mongodb://tickets-mongo-srv:27017/auth', {
    await mongoose.connect('mongodb://localhost:27017/tickets', {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      //useCreateIndex: true
    });
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3001, () => {
    console.log('Listening on port 3001!!!!!!!!');
  });


  rabbitService.startConsumer("order:created");
  rabbitService.startConsumer("order:updated");
  rabbitService.startConsumer("order:expired");

};

start();
