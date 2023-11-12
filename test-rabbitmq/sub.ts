import amqp, { Message } from "amqplib/callback_api";
export const express_port: number = 3000;
export const rabbit_host: string = "amqp://localhost";
export const rabbit_queue_name: string = "ticket:create";


amqp.connect(rabbit_host, (err: any, conn) => {
  if (err) {
    throw err; // error connecting
  }

  conn.createChannel((err, channel) => {
    if (err) {
      throw err; // error creating channel
    }

    console.log("consumer rabbitMQ : connected");
    channel.assertQueue(rabbit_queue_name, { durable: false });
    channel.consume(
      rabbit_queue_name,
      async (data: Message | null) => {
        if (data) {
          const msg = JSON.parse(data.content.toString());
          console.log(msg); // do your thing with the message
        }
      },
      { noAck: true }
    );
  });
});

