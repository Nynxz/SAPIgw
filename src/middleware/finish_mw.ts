import { NextFunction, Request, Response } from "express";

const AttachFinishHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const finishHandler = async () => {
    //await LogRouteAttempt(req, res, res.statusCode == 200);
    console.log(`[server]: Finished ${res.statusCode}`);
  };
  res.on("finish", finishHandler);
  next();
};

export { AttachFinishHandler };
