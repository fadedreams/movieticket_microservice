import { RabbitMQService } from "./utils";
const rabbitService = new RabbitMQService();

//import { addJobToQueue } from './expiration';
const start = async () => {



  rabbitService.startConsumer("order:created");

  //addJobToQueue({ name: 'Alice', age: 25 });
};

start();

