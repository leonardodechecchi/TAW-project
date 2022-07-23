import { ErrorRequestHandler, Express, RequestHandler } from 'express';
import { StatusError } from '../models/StatusError';

// Middleware for error handling
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof StatusError) {
    return res.status(err.statusCode).send(err.message);
  }
  console.log(err);
  return res.status(500).send(err.message);
};

// Middleware for invalid endpoint
const invalidEndpoint: RequestHandler = (req, res, next) => {
  return res.status(404).send('Invalid endpoint');
};

/**
 * Register all the app routes.
 * @param app the express app
 */
export function registerRoutes(app: Express) {
  app.use(errorHandler);
  app.use(invalidEndpoint);
}
