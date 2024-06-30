import { NextFunction, Request, Response, Router } from "express";
import { AttachFinishHandler } from "../middleware/finish_mw";
import { LoggingMiddleware } from "../middleware/logging_mw";
import { limiter30 } from "../middleware/ratelimit_mw";

function registerGET(
  app: Router,
  endpoint: string,
  callback: (req: Request, res: Response) => void,
  auth?: any //TODO: Figure out the type this should be?
) {
  if (!auth) {
    auth = (req: Request, res: Response, next: NextFunction) => {
      console.log("NO AUTH");
      next();
    };
  }
  app.get(
    endpoint,
    LoggingMiddleware,
    AttachFinishHandler,
    auth,
    limiter30,
    (req: Request, res: Response) => {
      callback(req, res);
    }
  );
}

function registerPOST(
  app: Router,
  endpoint: string,
  callback: (req: Request, res: Response) => void,
  auth?: any //TODO: Figure out the type this should be?
) {
  if (!auth) {
    auth = (req: Request, res: Response, next: NextFunction) => {
      console.log("NO AUTH");
      next();
    };
  }
  app.post(
    endpoint,
    LoggingMiddleware,
    AttachFinishHandler,
    limiter30,
    auth,
    (req: Request, res: Response) => {
      callback(req, res);
    }
  );
}

export { registerGET, registerPOST };
