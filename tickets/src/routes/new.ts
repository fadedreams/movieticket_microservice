import express, { Request, Response } from 'express';
import { requireAuth } from '@fadedreams7org1/common';
import { currentUser } from '@fadedreams7org1/common';

const router = express.Router();

router.post('/api/tickets', currentUser, requireAuth, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };

////////////////////////
//import express from 'express';
//import { currentUser } from '../middlewares/current-user';
//import { requireAuth } from '../middlewares/require-auth';

//import { currentUser } from '@fadedreams7org1/common';
//import { requireAuth } from '@fadedreams7org1/common';

//const router = express.Router();

//router.get('/api/users/currentuser2', currentUser, requireAuth, (req, res) => {
////router.get('/api/users/currentuser', currentUser, (req, res) => {
//console.log(req.session);
//res.send({ currentUser: req.currentUser || null });
//});

//export { router as currentUserRouter };

