import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { comparePassword } from "../lib/lib";
import { ApiKey } from "../schema/schema";
import { SimpleGateway } from "../SimpleGateway";

interface IAuthMW {
  (gateway: SimpleGateway): (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
}

class AuthMiddleware {
  name: string;
  callback: (
    gateway: SimpleGateway,
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<boolean>;
  // static gateway: SimpleGateway;
  // static SetGateway = (gateway: SimpleGateway) => {
  //   AuthMiddleware.gateway = gateway;
  // };

  // private passed: (req: Request, res: Response, next: NextFunction) => void;

  constructor(name: string, callback: any) {
    this.callback = callback;
    this.name = name;
  }

  public middleware: IAuthMW = (gateway: SimpleGateway) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      //Default Behaviour
      console.log(`[server]: AUTH ${this.name}...`);
      if (await this.callback(gateway, req, res, next)) {
        this.passed(req, res, next);
      } else {
        this.failed(req, res, next);
      }
    };
  };

  private passed = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[server]: AUTH ${this.name} OK`);
    next();
  };

  private failed(req: Request, res: Response, next: NextFunction) {
    console.log(`[server]: AUTH ${this.name} BAD`);
    return res.status(403).send(`Invalid ${this.name}`);
  }
}
export { AuthMiddleware, IAuthMW };

const requireValidAPIKeyAuth = new AuthMiddleware(
  "API Key",
  async (
    gateway: SimpleGateway,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const apiKey = req.query.apiKey?.toString();
    const validKey = await gateway.dbClient.checkAPIKey(apiKey);
    if (validKey) {
      res.locals.apikey = validKey as ApiKey;
      return true;
    } else {
      return false;
    }
  }
);

const requireValidCredentialsAuth = new AuthMiddleware(
  "Credentials",
  async (
    gateway: SimpleGateway,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { username, password } = req.body;
    const user = await gateway.dbClient.getUserByUsername(username);
    if (!user || !password) {
      console.log("Could not find user");
      return false;
    }
    const passwordValid = await comparePassword(password, user?.password!);
    res.locals.user = user;
    if (passwordValid) {
      return true;
    } else {
      return false;
    }
  }
);

const requireValidJWTAuth = new AuthMiddleware(
  "JWT",
  async (
    gateway: SimpleGateway,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return false;
      }
      const token = authHeader.split(" ")[1];
      return jwt.verify(token, "thisisasecret", (err, user) => {
        res.locals.user = user;
        if (err) return false;
        return true;
      });
    } catch (error) {
      console.log("CAUGHT ERROR:");
      console.log(error);
      return false;
    }
  }
);

export {
  requireValidAPIKeyAuth,
  requireValidCredentialsAuth,
  requireValidJWTAuth,
};
