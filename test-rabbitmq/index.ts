import express, { Request, Response } from "express";
import { RabbitMQService } from "./crabbitmq";

//export const express_port: number = 3000;
//export const rabbit_host: string = "amqp://localhost";
//export const rabbit_queue_name: string = "ticket:create";

const app = express();

const rabbitService = new RabbitMQService("amqp://localhost", "ticket:created");


const pro = rabbitService.startProducer();

function createDummyData(): any {
  const index = 0;
  const dummy = {
    name: "rabbit",
    food: "carrot",
    index: index,
  };
  dummy.index = index;
  return dummy;
}

app.get("/", (req: Request, res: Response) => {
  const data = createDummyData();
  pro(data);
  res.send("welcome to rabbit");
});

app.listen("3003", () => {
  console.log(`Express with Typescript! http://localhost:3000`);
});

rabbitService.startConsumer("ticket:created");
rabbitService.startConsumer("ticket:updated");

