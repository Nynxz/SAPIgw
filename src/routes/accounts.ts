import { Request, Response, Router } from "express";
import { registerHTTP } from "../lib/registerHTTP";
import { hashPassword } from "../lib/lib";
import { requireValidCredentialsAuth } from "../middleware/auth_mw";
import { generateJWT } from "../lib/jwt";
import * as schema from "../schema/schema";
import { SimpleGateway } from "../SimpleGateway";

export default (router: Router, gateway: SimpleGateway) => {
  registerHTTP(
    {
      method: "post",
      gateway,
      router,
      endpoint: "/accounts/create",
    },
    async (req: Request, res: Response) => {
      const { username, password } = req.body;
      if (username == undefined || password == undefined) {
        return res.send(
          "Failed to create account, Username and Password not specified."
        );
      }
      const hashedPassword = await hashPassword(password);
      const userExists = await gateway.dbClient.doesUserExist(username);
      if (!userExists && username && password) {
        const newUser: schema.NewUser = {
          username: username,
          password: hashedPassword,
        };
        if ((await gateway.dbClient.createUser(newUser)) != null) {
          return res.send(`Registered user: ${username}: ${password}`);
        }
      }
      return res.status(500).send(`Failed creating: ${username}`);
    }
  );

  registerHTTP(
    { method: "post", gateway, router, endpoint: "/accounts/login" },
    async (req: Request, res: Response) => {
      //TODO: standarize messages passed down through middleware (turn middleware into a class? idk)
      const user = res.locals.user as schema.User;
      const token = generateJWT(user);

      res.cookie("token", token, {
        httpOnly: false,
        secure: true,
        maxAge: 60 * 60 * 1000, //1h
      });

      res.send(`Got Valid Credentials: ${user.username}`);
      // TODO: JWT
    },
    requireValidCredentialsAuth.middleware
  );
};
