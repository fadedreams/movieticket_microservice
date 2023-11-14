import amqp, { Channel, Connection, Message } from "amqplib/callback_api";
import Queue, { Job } from 'bull';

export class RabbitMQService {
  private rabbitHost: string;
  private defaultQueueName: string;
  private channel: Channel | null = null;
  private queue1;

  constructor(rabbitHost: string = "amqp://localhost", defaultQueueName: string = "queue1") {
    this.rabbitHost = rabbitHost;
    this.defaultQueueName = defaultQueueName;
    this.queue1 = new Queue('queue1', {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    });

    this.setupJobProcessing();
  }
  private setupJobProcessing() {
    // Function to process a job
    const processJob = async (job: Job) => {
      console.log(`Processing job for ${job.data.id}`);

      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 5000));

      console.log(`Job processing completed for ${job.data.id}`);
      const produceMessage = await this.startProducer("order:expired");
      produceMessage({
        orderId: job.data.id,
        ticketId: job.data.ticket.id,
      });
      // Mark the job as completed
      await job.remove();
    };

    // Set up job processing
    this.queue1.process(processJob);

    // Handle errors during processing
    this.queue1.on('error', (error) => {
      console.error('Queue error:', error);
    });

    // Listen for completed jobs
    this.queue1.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM. Closing queue and exiting gracefully.');
      await this.queue1.close();
      process.exit(0);
    });
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
          }
        }
      },
      { noAck: true }
    );
  }


  private async handleOrderCreated(data: any) {
    const { id, title, price, userId, version } = data;

    await this.queue1.add({ id, title, price, userId, version });
    console.log(`Processing job for ${id} `);
    const produceMessage = await this.startProducer("order:expired");
    produceMessage({
      orderId: id,
      ticketId: data.ticket.id
    });
  }

}



