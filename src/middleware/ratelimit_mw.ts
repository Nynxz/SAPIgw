import rateLimit from "express-rate-limit";
//TODO: make this better...
import { NextFunction, Request, Response } from "express";

let pingRateLimitReached = (req: Request, res: Response) => {
  console.log(`A rate limit has been reached on ${req.path}... investigate?`);
  console.log(req);
  res.status(429).send("Too many requests, please try again later.");
};

let pingRateLimitReachedHello = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`A rate limit has been reached on ${req.path}... investigate?`);
  res.status(429).send("Too many requests, please try again later.");
};

const limiter2 = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
  handler: pingRateLimitReached,
  skip: (req, res) => {
    if (req.path == "/hello") {
      return true;
    } else {
      return false;
    }
  },
});

const limiter30 = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 60, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.

  // store: ... , // Redis, Memcached, etc. See below.
  handler: pingRateLimitReachedHello,
});

export { limiter2, limiter30 };
