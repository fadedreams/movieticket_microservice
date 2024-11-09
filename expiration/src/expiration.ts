import Queue, { Job } from 'bull';
import { RabbitMQService } from './utils';

const rabbitService = new RabbitMQService("amqp://localhost", "ticket:create");

// Updated Queue configuration with KeyDB options
const queue1 = new Queue('queue1', {
    redis: {
        host: process.env.KEYDB_HOST || 'localhost',
        port: 6379,
        maxRetriesPerRequest: 20,
        enableReadyCheck: false,  // KeyDB specific optimization
        commandTimeout: 5000,
        retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        }
    },
});
// Function to process a job
const processJob = async (job: Job) => {
    console.log(`Processing job for ${job.data.id}`);

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log(`Job processing completed for ${job.data.id}`);
    const produceMessage = await rabbitService.startProducer("order:expired");
    produceMessage({
        orderId: job.data.id,
        ticketId: job.data.ticket.id
    });

    // Mark the job as completed
    await job.remove();
};

// Set up job processing
queue1.process(processJob);

// Function to add a job to the queue with customizable data
const addJobToQueue = async (jobData) => {
    const { id, title, price, userId, version } = jobData;
    await queue1.add(jobData);
};

// Handle errors during processing
queue1.on('error', (error) => {
    console.error('Queue error:', error);
});

// Listen for completed jobs
queue1.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Closing queue and exiting gracefully.');
    await queue1.close();
    process.exit(0);
});

// Export the addJobToQueue function
export { addJobToQueue };

