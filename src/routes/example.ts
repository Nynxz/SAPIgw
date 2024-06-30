import { Request, Response, Router } from "express";
import { registerGET, registerPOST } from "../lib/registerHTTP";
// import { createAPIKeyForUser, getApiKeysOfUserById } from "../lib/db";
// import { User } from "@prisma/client";
import { requireValidCredentialsAuth } from "../middleware/auth_mw";

export default (router: Router) => {
  registerGET(router, "/hello/", async (req: Request, res: Response) => {
    //const apiKeys = await getApiKeysOfUserById(res.locals.user.id);
    //res.send(apiKeys);
  });

  registerPOST(router, "/hello/", async (req: Request, res: Response) => {
    res.send("Hello!");
  });
};
