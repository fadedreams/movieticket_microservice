import amqp, { Channel, Connection, Message } from "amqplib/callback_api";

export class RabbitMQService {
  private rabbitHost: string;
  private defaultQueueName: string;
  private channel: Channel | null = null;

  constructor(rabbitHost: string = "amqp://localhost", defaultQueueName: string = "queue1") {
    this.rabbitHost = rabbitHost;
    this.defaultQueueName = defaultQueueName;
  }

  public startProducer(queueName: string = this.defaultQueueName) {
    console.log("Producer rabbitMQ : connecting");

    amqp.connect(this.rabbitHost, (err: any, connection: Connection) => {
      if (err) {
        throw err;
      }

      connection.createChannel((err: any, channel: Channel) => {
        if (err) {
          throw err;
        }

        this.channel = channel;

        // Declare the queue
        this.channel.assertQueue(queueName, { durable: false });

        console.log("Producer rabbitMQ : connected");
      });
    });

    return (data: any) => {
      if (!this.channel) {
        throw new Error("Channel not initialized");
      }

      const msg = JSON.stringify(data);

      // Ensure the queue is declared before sending the message
      this.channel.assertQueue(queueName, { durable: false });

      this.channel.sendToQueue(queueName, Buffer.from(msg));
    };
  }

  public startConsumer(queueName: string = this.defaultQueueName) {
    console.log("Consumer rabbitMQ : connecting");

    amqp.connect(this.rabbitHost, (err: any, conn) => {
      if (err) {
        throw err;
      }

      conn.createChannel((err, channel) => {
        if (err) {
          throw err;
        }

        console.log("Consumer rabbitMQ : connected");
        channel.assertQueue(queueName, { durable: false });
        channel.consume(
          queueName,
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
  }
}
