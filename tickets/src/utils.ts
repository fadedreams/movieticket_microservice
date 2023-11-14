import amqp, { Channel, Connection, Message } from "amqplib/callback_api";
import { Ticket } from "./models/ticket";

export class RabbitMQService {
  private rabbitHost: string;
  private defaultQueueName: string;
  private channel: Channel | null = null;

  constructor(rabbitHost: string = "amqp://localhost", defaultQueueName: string = "queue1") {
    this.rabbitHost = rabbitHost;
    this.defaultQueueName = defaultQueueName;
  }


  public startProducer(queueName: string = this.defaultQueueName): Promise<(data: any) => void> {
    console.log("Producer rabbitMQ: connecting");

    return new Promise((resolve, reject) => {
      const connectAndCreateChannel = (retryCount: number = 0) => {
        amqp.connect(this.rabbitHost, (err: any, connection: Connection) => {
          if (err) {
            if (retryCount < 3) {
              console.log(`Producer rabbitMQ: connection attempt ${retryCount + 1} failed. Retrying...`);
              setTimeout(() => connectAndCreateChannel(retryCount + 1), 3000); // Retry after 3 seconds
            } else {
              reject(err); // Max retries reached, reject with the error
            }
          } else {
            connection.createChannel((err: any, channel: Channel) => {
              if (err) {
                if (retryCount < 3) {
                  console.log(`Producer rabbitMQ: channel creation attempt ${retryCount + 1} failed. Retrying...`);
                  setTimeout(() => connectAndCreateChannel(retryCount + 1), 3000); // Retry after 3 seconds
                } else {
                  reject(err); // Max retries reached, reject with the error
                }
              } else {
                this.channel = channel;

                // Declare the queue
                this.channel.assertQueue(queueName, { durable: false });

                console.log("Producer rabbitMQ: connected");

                resolve((data: any) => {
                  if (!this.channel) {
                    reject(new Error("Channel not initialized"));
                  }

                  const msg = JSON.stringify(data);

                  // Ensure the queue is declared before sending the message
                  this.channel.assertQueue(queueName, { durable: false });

                  this.channel.sendToQueue(queueName, Buffer.from(msg));
                });
              }
            });
          }
        });
      };

      connectAndCreateChannel();
    });
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

        this.channel = channel;

        // Declare the queue
        this.channel.assertQueue(queueName, { durable: false });

        console.log("Consumer rabbitMQ : connected");
        this.consumeMessages(queueName);
      });
    });
  }

  private consumeMessages(queueName: string) {
    if (!this.channel) {
      console.warn("Channel not ready. Cannot consume messages.");
      return;
    }

    this.channel.consume(
      queueName,
      async (data: Message | null) => {
        if (data) {
          const msg = JSON.parse(data.content.toString());
          console.log(msg); // do your thing with the message
          if (queueName === "order:created") {
            await this.handleOrderCreated(msg);
          } else if (queueName === "order:updated") {
            await this.handleOrderUpdated(msg);
          }
        }
      },
      { noAck: true }
    );
  }

  private async handleOrderCreated(data: any) {
    const { id, title, price, userId, version } = data;
    //find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    //mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: id });
    //save the ticket
    await ticket.save();
    console.log("handleOrderCreated :", ticket);



  }

  private async handleOrderUpdated(data: any) {
    const { id, title, price, userId, version } = data;

    // Find the ticket that the order is updating
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Check if the order status is now "Cancelled" or any other relevant status
    if (data.status === 'Cancelled') {
      // If the order is cancelled, update the ticket's reservation status
      ticket.set({ orderId: null });
    }

    // You might have other logic to handle different order update scenarios

    // Save the updated ticket
    await ticket.save();
    console.log("handleOrderUpdated:", ticket);
  }

}

