import express, { Request, Response } from "express"; // Import Request and Response types
import { express_port } from "./sub";
import { RabbitProducer } from "./pub";

const app = express();

let index = 0;
const dummy = {
  name: "rabbit",
  food: "carrot",
  index: index,
};
const pro = RabbitProducer();

function createDummyData(): any {
  index++;
  dummy.index = index;
  return dummy;
}

app.get("/", (req: Request, res: Response) => { // Specify Request and Response types
  const data = createDummyData();
  pro(data);
  res.send("welcome to rabbit");
});

app.listen(express_port, () => {
  console.log(`Express with Typescript! http://localhost:${express_port}`);
});

