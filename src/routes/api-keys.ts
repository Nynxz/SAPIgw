import { Request, Response, Router } from "express";
import { registerHTTP } from "../lib/registerHTTP";
// import { createAPIKeyForID, getApiKeysOfUserById } from "../lib/db";
import { requireValidCredentialsAuth } from "../middleware/auth_mw";
import { apikey, User } from "../schema/schema";
import { SimpleGateway } from "../SimpleGateway";

export default (router: Router, gateway: SimpleGateway) => {
  registerHTTP(
    { method: "get", gateway, router, endpoint: "/api-keys/" },
    async (req: Request, res: Response) => {
      const apiKeys = await gateway.dbClient.getAPIKeysOfUserByID(
        res.locals.user.id
      );
      res.send(apiKeys);
    },
    requireValidCredentialsAuth.middleware.bind(requireValidCredentialsAuth)
  );

  registerHTTP(
    {
      method: "post",
      gateway,
      router,
      endpoint: "/api-keys/create",
    },
    async (req: Request, res: Response) => {
      const user = res.locals.user as User;
      const _apiKey = await gateway.dbClient.createAPIKeyForID(user.id);
      res.send(`Created API Key for ${user.username}: ${_apiKey?.key}`);
    },
    requireValidCredentialsAuth.middleware
  );
};
