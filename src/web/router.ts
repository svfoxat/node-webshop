import mysql from "mysql2/promise";
import express from "express";
import IndexRoute from "./routes";
import winston from "winston";
import { GETRegisterRoute, POSTRegisterRoute } from "./routes/register";
import UserController from "../controller/user.controller";
import { GETLoginRoute, GETLogoutRoute, POSTLoginRoute } from "./routes/login";
import { POSTCartRoute, GETCartRoute, DELETECartRoute } from "./routes/cart";
import CartController from "../controller/cart.controller";

export type WebRouterConfig = {
  db: mysql.Connection;
  logger: winston.Logger;
};

export type RouteConfig = {
  db: mysql.Connection;
  logger: winston.Logger;
  users: UserController;
  carts: CartController;
};

export class WebRouter {
  router: express.Router;
  config: WebRouterConfig;
  users: UserController;
  carts: CartController;

  constructor(config: WebRouterConfig) {
    this.config = config;
    this.router = express.Router();

    this.setupDependencies();
    this.setupRoutes();
  }

  private setupDependencies() {
    this.users = new UserController(this.config.db);
    this.carts = new CartController(this.config.db);
  }

  private setupRoutes() {
    const config: RouteConfig = {
      ...this.config,
      users: this.users,
      carts: this.carts,
    };

    this.router.get("/", IndexRoute(config));
    this.router.get("/register", GETRegisterRoute(config));
    this.router.post("/register", POSTRegisterRoute(config));
    this.router.get("/login", GETLoginRoute(config));
    this.router.post("/login", POSTLoginRoute(config));
    this.router.get("/logout", GETLogoutRoute(config));

    this.router.post("/shopping-cart", POSTCartRoute(config));
    this.router.get("/shopping-cart", GETCartRoute(config));
    this.router.delete("/shopping-cart", DELETECartRoute(config));
  }
}
