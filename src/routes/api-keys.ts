import { Request, Response, Router } from "express";
import { registerGET, registerPOST } from "../lib/registerHTTP";
// import { createAPIKeyForID, getApiKeysOfUserById } from "../lib/db";
import { requireValidCredentialsAuth } from "../middleware/auth_mw";
import { apikey, User } from "../schema/schema";
import { SimpleGateway } from "../SimpleGateway";

export default (router: Router, gateway: SimpleGateway) => {
  registerGET(
    router,
    "/api-keys/",
    async (req: Request, res: Response) => {
      const apiKeys = await gateway.dbClient.getAPIKeysOfUserByID(
        res.locals.user.id
      );
      res.send(apiKeys);
    },
    requireValidCredentialsAuth.middleware.bind(requireValidCredentialsAuth)
  );

  registerPOST(
    router,
    "/api-keys/create",
    async (req: Request, res: Response) => {
      const user = res.locals.user as User;
      const _apiKey = await gateway.dbClient.createAPIKeyForID(user.id);
      res.send(`Created API Key for ${user.username}: ${_apiKey?.key}`);
    },
    requireValidCredentialsAuth.middleware.bind(requireValidCredentialsAuth)
  );
};
