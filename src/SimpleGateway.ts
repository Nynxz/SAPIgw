import express, { Express, RequestHandler, Router } from "express";
import { Config, CreateConfig } from "./lib/config";
import { readdirSync } from "fs";
import { join } from "path";
import postgres, { Sql } from "postgres";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";

//import cors from "cors";

class SimpleGateway {
  app: Express;
  config: Config;
  middleware: RequestHandler[];
  apiRouter: Router;
  db: PostgresJsDatabase<Record<string, never>>; //ts is le cooked
  queryClient: Sql<{}>;

  constructor() {
    this.app = express();
    this.config = CreateConfig();
    //TODO : Turn this shit into another class that we pass config to instantiate, then we use that class instead of this shit
    this.queryClient = postgres(this.config.DATABASE_URL);
    this.db = drizzle(this.queryClient);
    this.middleware = [
      express.json(),
      // cors({
      //   origin: `http://localhost:${this.config.PORT}`,
      //   credentials: true,
      // }),
    ];

    this.apiRouter = express.Router();

    this._configureMiddleware(this.app, this.middleware);
    this._loadRoutes(this.apiRouter);
    this.app.use("/api", this.apiRouter);
  }

  start() {
    this.app.listen(this.config.PORT, () => {
      console.log(
        `[server]: Server is running at http://localhost:${this.config.PORT}`
      );
    });
  }

  private _configureMiddleware = (app: Express, middleware: unknown[]) => {
    middleware.forEach((_middleware: any) => {
      app.use(_middleware);
    });
  };

  private _loadRoutes = (app: Router) => {
    try {
      const routesDir = join(__dirname, "routes");
      const routeFiles = readdirSync(routesDir).filter((file) =>
        file.endsWith(".ts")
      );
      for (const file of routeFiles) {
        const filePath = join(routesDir, file);
        const registerRoutes = require(filePath).default;
        if (typeof registerRoutes === "function") {
          registerRoutes(app);
        }
      }
    } catch (error) {
      console.log(`[server]: WARN - NO ROUTES LOADED`);
      console.log(`[server]: WARN - Did you create a /routes folder?`);
    }
  };
}

export { SimpleGateway, Config };
