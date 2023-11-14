
import { RabbitMQService } from "./utils";
const rabbitService = new RabbitMQService();
(async () => {
  try {
    const produceMessage = await rabbitService.startProducer("order:created");
    produceMessage({
      id: "655372b0da37eb1ffe3e48c0",
      status: "created",
      userId: "654e8e269007c3c62a61b535",
      expiresAt: "2023-11-14T13:42:58.275Z",
      ticket: {
        id: "655372b0da37eb1ffe3e48c1",
        price: "100",
      },
    });
  } catch (e) {
    // Deal with the fact the chain failed
  }
})();
