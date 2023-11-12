export const express_port: number = 3000;
export const rabbit_host: string = "amqp://localhost";
export const default_rabbit_queue_name: string = "my_queue";

import amqp, { Channel, Connection } from "amqplib/callback_api";

export function RabbitProducer(queueName: string = default_rabbit_queue_name) {
  console.log("producer rabbitMQ : connecting");
  let theChannel: Channel;

  amqp.connect(rabbit_host, async (err: any, connection: Connection) => {
    if (err) {
      throw err;
    }

    connection.createChannel((err: any, channel: Channel) => {
      if (err) {
        throw err;
      }

      theChannel = channel;

      // Declare the queue
      theChannel.assertQueue(queueName, { durable: false });

      console.log("producer rabbitMQ : connected");
    });
  });

  return (data: any) => {
    const msg = JSON.stringify(data);

    // Ensure the queue is declared before sending the message
    theChannel.assertQueue(queueName, { durable: false });

    theChannel.sendToQueue(queueName, Buffer.from(msg));
  };
}

