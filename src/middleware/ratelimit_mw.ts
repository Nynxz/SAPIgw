import rateLimit from "express-rate-limit";
//TODO: make this better...
import { NextFunction, Request, Response } from "express";

type LimiterConfig = {
  windowMinutes: number;
  limit: number;
  pathsToSkip?: string[];
};
const RateLimitMW = ({
  windowMinutes,
  limit,
  pathsToSkip = [],
}: LimiterConfig) => {
  const _pingRateLimitReached = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(`A rate limit has been reached on ${req.path}... investigate?`);
    res.status(429).send("Too many requests, please try again later.");
  };

  const _skipFunc =
    (_pathsToSkip: string[]) => (req: Request, res: Response) => {
      if (req.path in _pathsToSkip) {
        return true;
      }
      return false;
    };

  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-7", // IDK WTF this means?
    legacyHeaders: false,
    handler: _pingRateLimitReached,
    skip: _skipFunc(pathsToSkip),
  });
};

export { RateLimitMW };
