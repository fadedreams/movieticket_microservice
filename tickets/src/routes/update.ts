import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { currentUser } from '@fadedreams7org1/common';
import { RabbitMQService } from "@fadedreams7org1/common";

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@fadedreams7org1/common';
import { Ticket } from '../models/ticket';

const router = express.Router();
const rabbitService = new RabbitMQService("amqp://localhost", "ticket:create");

router.put(
  '/api/tickets/:id', currentUser,
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.orderId) {
      throw new Error('Cannot edit a reserved ticket');
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    const produceMessage = rabbitService.startProducer("ticket:updated");
    produceMessage({
      title: req.body.title,
      price: req.body.price,
    });
    res.send(ticket);
  }
);

export { router as updateTicketRouter };

