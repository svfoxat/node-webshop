import mysql from "mysql2/promise";
import express from "express";
import IndexRoute from "./routes";
import winston from "winston";
import { GETRegisterRoute, POSTRegisterRoute } from "./routes/register";
import UserService from "../service/user";
import { GETLoginRoute, GETLogoutRoute, POSTLoginRoute } from "./routes/login";
import { POSTCartRoute, GETCartRoute, DELETECartRoute } from "./routes/cart";
import CartService from "../service/cart";
import ProductService from "../service/product";
import { MysqlProductStore } from "../model/product";
import { MysqlShoppingCartStore } from "../model/shopping_cart";
import { MysqlUserStore } from "../model/user";

export type WebRouterConfig = {
  db: mysql.Connection;
  logger: winston.Logger;
};

export type RouteConfig = {
  db: mysql.Connection;
  logger: winston.Logger;
  users: UserService;
  carts: CartService;
  products: ProductService;
};

export class WebRouter {
  router: express.Router;
  config: WebRouterConfig;
  users: UserService;
  carts: CartService;
  products: ProductService;

  constructor(config: WebRouterConfig) {
    this.config = config;
    this.router = express.Router();

    this.setupDependencies();
    this.setupRoutes();
  }

  private setupDependencies() {
    this.users = new UserService(
      new MysqlUserStore(this.config.db),
      this.config.logger,
    );
    this.carts = new CartService(
      new MysqlShoppingCartStore(this.config.db),
      this.config.logger,
    );
    this.products = new ProductService(
      new MysqlProductStore(this.config.db),
      this.config.logger,
    );
  }

  private setupRoutes() {
    const config: RouteConfig = {
      ...this.config,
      users: this.users,
      carts: this.carts,
      products: this.products,
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
