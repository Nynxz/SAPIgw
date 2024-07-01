import { Request, Response, Router } from "express";
import { registerHTTP } from "../lib/registerHTTP";
import {
  requireValidAPIKeyAuth,
  requireValidCredentialsAuth,
  requireValidJWTAuth,
} from "../middleware/auth_mw";
// import { getUserOfAPIKey } from "../lib/db";
import { ApiKey } from "../schema/schema";
import { SimpleGateway } from "../SimpleGateway";

export default (router: Router, gateway: SimpleGateway) => {
  registerHTTP(
    { method: "post", gateway, router, endpoint: "/testing/apikey/hello" },
    async (req: Request, res: Response) => {
      const validKey = res.locals.apikey as ApiKey;
      console.log(validKey);
      const user = await gateway.dbClient.getUserOfAPIKey(validKey);
      if (!user) {
        res.status(403).send("Owner of API Key not found");
      } else {
        res.send(`Hello ${user?.username}!`);
      }
    },
    requireValidAPIKeyAuth.middleware
  );

  registerHTTP(
    { method: "post", gateway, router, endpoint: "/testing/jwt/hello" },
    async (req: Request, res: Response) => {
      console.log(res.locals.user);
      console.log(
        Math.floor(((res.locals.user.exp - Date.now() / 1000) / 60) * 10) / 10 +
          " Minutes left"
      );
      //TODO: read JWT
      res.send(`Hello ${res.locals.user.username}!`);
    },
    requireValidJWTAuth.middleware
  );

  registerHTTP(
    { method: "post", gateway, router, endpoint: "/testing/credentials/hello" },
    async (req: Request, res: Response) => {
      const user = res.locals.user;
      if (!user) {
        res.status(403).send("Owner of API Key not found");
      } else {
        console.log(res.locals.user);
        res.send(`Hello ${user?.username}!`);
      }
    },
    requireValidCredentialsAuth.middleware
  );
};
