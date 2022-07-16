import Router, { ErrorRequestHandler, RequestHandler } from 'express';
import { app } from '..';
import { StatusError } from '../models/User';

const router = Router();

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof StatusError) {
    return res.status(err.statusCode).send(err.message);
  }
  console.log(err);
  return res.sendStatus(500);
};

const invalidEndpoint: RequestHandler = (req, res, next) => {
  return res.status(404).send('Invalid endpoint');
};

app.use(errorHandler);
app.use(invalidEndpoint);

export = router;
