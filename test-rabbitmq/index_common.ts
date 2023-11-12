import { RabbitMQService } from "@fadedreams7org1/common";
import express, { Request, Response } from "express";

const app = express();

const rabbitService = new RabbitMQService("amqp://localhost", "queue2");


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

rabbitService.startConsumer();


