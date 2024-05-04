import { ProductRepository } from "../../model/product";
import { RouteConfig } from "../router";
import express from "express";

export default function IndexRoute(config: RouteConfig) {
  return async function (req: express.Request, res: express.Response) {
    try {
      const products = await ProductRepository.readMany(0, 10, config.db);
      res.render("index", { products: products });
    } catch (e) {
      config.logger.log("error", e);
      res.sendStatus(500);
    }
  };
}
