import { RouteConfig } from "../router";
import express, { Router } from "express";

export function GETCartRoute(config: RouteConfig) {
  return async function (req: express.Request, res: express.Response) {
    if (req.session.userId) {
      const cart = await config.carts.getCartForUser(req.session.userId);
      const items = await config.carts.getItemsForCart(cart.id);
      res.render("shopping-cart", { cart: cart, items: items });
    }
  };
}

export function POSTCartRoute(config: RouteConfig) {
  return async function (req: express.Request, res: express.Response) {
    const { product_id, quantity } = req.query;

    if (req.session.userId) {
      const cart = await config.carts.getCartForUser(req.session.userId);
      await config.carts.addProductToCart(
        product_id as string,
        parseInt(quantity as string),
        cart.id,
      );
    }
    res.setHeader("HX-Trigger", "refresh_cart");
    res.status(200).send("Add to cart");
  };
}

export function DELETECartRoute(config: RouteConfig) {
  return async function (req: express.Request, res: express.Response) {
    const { item_id } = req.query;

    if (req.session.userId) {
      const cart = await config.carts.getCartForUser(req.session.userId);
      await config.carts.removeItemFromCart(cart.id, item_id as string);

      res.setHeader("HX-Trigger", "refresh_cart");
      res.status(200);
      res.send();
    }
  };
}
