import express from 'express';

import 'express-async-errors';
import cors from 'cors';

import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { createTicketRouter } from './routes/new';

//import { errorHandler } from './middlewares/error-handler';
//import { NotFoundError } from './errors/not-found-error';

import { errorHandler } from '@fadedreams7org1/common';
import { NotFoundError } from '@fadedreams7org1/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
//app.use(
//cookieSession({
//signed: false,
//secure: false
//})
//);
app.use(
  cookieSession({
    name: 'session', // name of the cookie
    keys: ['secret'], // array of secret keys for encryption
    maxAge: 24 * 60 * 60 * 1000, // session expiration time (24 hours in milliseconds)
    secure: false, // set to true if using https
    httpOnly: false, // cookie is not accessible via client-side script
  })
);
//app.use(cors());
//app.use(cors({ origin: true, credentials: true }));
const corsOptions = {
  origin: ["http://localhost:8080"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));


app.use(createTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

