import mysql from "mysql2/promise";
import express from "express";
import IndexRoute from "./routes";

export type WebRouterConfig = {
  db: mysql.Connection;
};

export type RouteConfig = {
  db: mysql.Connection;
  baseView: string;
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
    this.router.use("/", IndexRoute({ db: this.config.db, baseView: "" }));
  }
}
