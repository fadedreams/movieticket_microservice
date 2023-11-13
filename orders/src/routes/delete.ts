import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@fadedreams7org1/common';
import { currentUser } from '@fadedreams7org1/common';
import { Order, OrderStatus } from '../models/order';
import { RabbitMQService } from "@fadedreams7org1/common";

const router = express.Router();
const rabbitService = new RabbitMQService("amqp://localhost", "ticket:create");

router.delete(
  '/api/orders/:orderId',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    const produceMessage = rabbitService.startProducer("order:cancelled");
    produceMessage({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    // publishing an event saying this was cancelled!

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
