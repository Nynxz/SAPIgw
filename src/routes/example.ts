import { Request, Response, Router } from "express";
import { registerHTTP } from "../lib/registerHTTP";
import { SimpleGateway } from "../SimpleGateway";

export default (router: Router, gateway: SimpleGateway) => {
  registerHTTP(
    { method: "get", gateway, router, endpoint: "/hello/" },
    async (req: Request, res: Response) => {
      res.send("Hello!");
    }
  );

  registerHTTP(
    { method: "post", gateway, router, endpoint: "/hello/" },
    async (req: Request, res: Response) => {
      res.send("Hello!");
    }
  );
};
