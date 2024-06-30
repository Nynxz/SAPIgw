import { NextFunction, Request, Response } from "express";
//TODO: ?? maybe?? Move finishhandler create point to here? as this can be all round logging?
const CreatePoint = (req: Request, res: Response) => {
  // Created on 'Finish'
  // Created on Rate Limit Reached
};
const LoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `-----------------------
[server]: ${req.method}: ${req.baseUrl}${req.route.path} `
  );
  next();
};

export { LoggingMiddleware };
