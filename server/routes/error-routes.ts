import Router, { ErrorRequestHandler, RequestHandler } from 'express';

const router = Router();

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).json(err);
};

const invalidEndpoint: RequestHandler = (req, res, next) => {
  res.status(500).send('Invalid endpoint');
};

router.use(errorHandler);
router.use(invalidEndpoint);

export = router;
