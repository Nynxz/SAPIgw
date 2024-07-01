import {
  IRouter,
  IRouterMatcher,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import { AttachFinishHandler } from "../middleware/finish_mw";
import { LoggingMiddleware } from "../middleware/logging_mw";
import { RateLimitMW } from "../middleware/ratelimit_mw";
import { IAuthMW } from "../middleware/auth_mw";
import { SimpleGateway } from "../SimpleGateway";

type RouteMethod = "get" | "post";

type RegisterConfig = {
  method: RouteMethod;
  gateway: SimpleGateway;
  router: Router;
  endpoint: string;
};

const _defaultNOAUTHFALLBACK: IAuthMW =
  () => (req: Request, res: Response, next: NextFunction) => {
    console.log(`[server]: NO AUTH REQUIRED`);
    next();
  };

function registerHTTP(
  { method, gateway, router, endpoint }: RegisterConfig,
  callback: (req: Request, res: Response) => void,
  auth: IAuthMW = _defaultNOAUTHFALLBACK
) {
  router[method](
    endpoint,
    LoggingMiddleware,
    AttachFinishHandler,
    auth(gateway),
    RateLimitMW({ limit: 5, windowMinutes: 1 }),
    (req: Request, res: Response) => {
      callback(req, res);
    }
  );
}

export { registerHTTP };
