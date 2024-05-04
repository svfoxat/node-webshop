import mysql from "mysql2/promise";
import express from "express";
import IndexRoute from "./routes";
import winston from "winston";

export type WebRouterConfig = {
  db: mysql.Connection;
  logger: winston.Logger;
};

export type RouteConfig = {
  db: mysql.Connection;
  logger: winston.Logger;
};

export class WebRouter {
  router: express.Router;
  config: WebRouterConfig;

  constructor(config: WebRouterConfig) {
    this.config = config;
    this.router = express.Router();

    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.use(
      "/",
      IndexRoute({
        logger: this.config.logger,
        db: this.config.db,
      }),
    );
  }
}
