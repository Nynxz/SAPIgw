# SAPIgw - Simple API Gateway

Built ontop of 
- Express.js
- PostgreSQL
- Prometheus -- TODO
- Grafana -- TODO


Includes
- Hot Reloading
- JSON Webtokens
- API Keys
- User Credentials
- Rate Limiting

This currently runs the express server and postgres database in containers, with plans to add prometheus and grafana in the future.

I have written a [blog post](https://www.nynxz.com/post/18) outlining a similar setup with InfluxDB.


none of this is secure 🤷‍♂️ this is just a fun project for me to learn with, feel free to contact me!

Running
--- 
modify `compose.yaml` with a different password in the Postgres Service and DATABASE_URL of the Gateway Service 


```docker compose up```

will run the gateway and database

http://localhost:4000/api/


create a file in the /src/routes directory
similar to the example.ts

```js
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
```

examples of using the different builtin auth middleware are shown in **/src/testing.ts**






