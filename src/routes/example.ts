import { Request, Response, Router } from "express";
import { registerGET, registerPOST } from "../lib/registerHTTP";

export default (router: Router) => {
  registerGET(router, "/hello/", async (req: Request, res: Response) => {
    res.send("Hello!");
  });

  registerPOST(router, "/hello/", async (req: Request, res: Response) => {
    res.send("Hello!");
  });
};
