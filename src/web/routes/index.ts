import { ShoppingCart } from "../../model/shopping_cart";
import { ProductRepository } from "../../model/product";
import { RouteConfig } from "../router";
import express from "express";

export default function IndexRoute(config: RouteConfig) {
  return async function (req: express.Request, res: express.Response) {
    try {
      let cart: ShoppingCart = null;
      if (req.session.userId) {
        cart = await config.carts.getCartForUser(req.session.userId);
      }

      const products = await ProductRepository.readMany(0, 25, config.db);
      res.render("index", {
        products: products,
        authenticated: !!req.session.userId,
        cart: cart,
      });
    } catch (e) {
      config.logger.log("error", e);
      res.sendStatus(500);
    }
  };
}
