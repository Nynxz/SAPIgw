import { Request, Response, Router } from "express";
import { registerGET, registerPOST } from "../lib/registerHTTP";
import { SimpleGateway } from "../SimpleGateway";

export default (router: Router, gateway: SimpleGateway) => {
  registerGET(router, "/hello/", async (req: Request, res: Response) => {
    res.send("Hello!");
  });

  registerPOST(router, "/hello/", async (req: Request, res: Response) => {
    res.send("Hello!");
  });
};
