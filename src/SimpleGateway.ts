import express, { Express, RequestHandler, Router } from "express";
import { Config, CreateConfig } from "./lib/config";
import { readdirSync } from "fs";
import { join } from "path";
import postgres, { Sql } from "postgres";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { DBClient } from "./DBClient";
import { AuthMiddleware } from "./middleware/auth_mw";
import { Server } from "http";

//import cors from "cors";
type SimpleGatewayConfig = {
  testing: boolean;
};
class SimpleGateway {
  app: Express;
  config: Config;
  middleware: RequestHandler[];
  apiRouter: Router;
  dbClient: DBClient;
  server: Server | undefined;

  constructor(_config: SimpleGatewayConfig = { testing: false }) {
    this.app = express();
    this.config = CreateConfig();

    this.dbClient = new DBClient(
      _config.testing ? this.config.DATABASE_URL_TEST : this.config.DATABASE_URL
    );
    this.middleware = [
      express.json(),
      express.text(),
      // cors({
      //   origin: `http://localhost:${this.config.PORT}`,
      //   credentials: true,
      // }),
    ];

    this.apiRouter = express.Router();

    this._configureMiddleware(this.app, this.middleware);
    this._loadRoutes(this.apiRouter); //seperated - later may use files to seperate into base routes
    this.app.use("/api", this.apiRouter);
  }

  start() {
    this.server = this.app.listen(this.config.PORT, () => {
      console.log(
        `[server]: Server is running at http://localhost:${this.config.PORT}`
      );
    });
  }

  stop = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.dbClient.queryClient.end();
      this.server?.close((err) => {
        if (err) reject();
        else resolve();
      });
    });
  };

  private _configureMiddleware = (app: Express, middleware: unknown[]) => {
    middleware.forEach((_middleware: any) => {
      app.use(_middleware);
    });
  };

  private _loadRoutes = (router: Router) => {
    try {
      const routesDir = join(__dirname, "routes");
      const routeFiles = readdirSync(routesDir).filter((file) =>
        file.endsWith(".ts")
      );
      for (const file of routeFiles) {
        const filePath = join(routesDir, file);
        const registerRoutes = require(filePath).default;
        if (typeof registerRoutes === "function") {
          registerRoutes(router, this);
        }
      }
    } catch (error) {
      console.log(error);
      console.log(`[server]: WARN - NO ROUTES LOADED`);
      console.log(`[server]: WARN - Did you create a /routes folder?`);
    }
  };
}

export { SimpleGateway, Config };
