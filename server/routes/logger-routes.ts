import Router, { RequestHandler } from 'express';
import colors from 'colors';
colors.enable();

const router = Router();

const getActualRequestDurationInMilliseconds = (start: [number, number]) => {
  const NS_PER_SEC = 1e9; // convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const logger: RequestHandler = (req, res, next) => {
  const currentDatetime = new Date();
  const formattedDate =
    currentDatetime.getFullYear() +
    '-' +
    (currentDatetime.getMonth() + 1) +
    '-' +
    currentDatetime.getDate() +
    ' ' +
    currentDatetime.getHours() +
    ':' +
    currentDatetime.getMinutes() +
    ':' +
    currentDatetime.getSeconds();
  const method = req.method;
  const url = req.url;
  const status = res.statusCode;
  const start = process.hrtime();
  const durantionInMilliseconds = getActualRequestDurationInMilliseconds(start);
  const log = `[${colors.blue(formattedDate)}] ${method}:${url} ${status} ${colors.red(
    durantionInMilliseconds.toLocaleString() + 'ms'
  )} `;
  console.log(log);
  next();
};

router.use(logger);

export = router;
