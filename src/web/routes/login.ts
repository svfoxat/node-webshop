import { RouteConfig } from "../router";
import express from "express";

export function GETLoginRoute(config: RouteConfig) {
  return async function (req: express.Request, res: express.Response) {
    try {
      res.render("login", { error: null, authenticated: !!req.session.userId });
    } catch (e) {
      config.logger.log("error", e);
      res.sendStatus(500);
    }
  };
}

export function GETLogoutRoute(config: RouteConfig) {
  return async function (req: express.Request, res: express.Response) {
    req.session = null;
    res.clearCookie("session");
    res.redirect("/");
  };
}

export function POSTLoginRoute(config: RouteConfig) {
  return async function (req: express.Request, res: express.Response) {
    const { email, password } = req.body;

    try {
      const user = await config.users.login(email, password);

      req.session.userId = user.id;
      // TODO: merge shopping_carts?

      res.setHeader("HX-Redirect", "/");
      res.sendStatus(200);
    } catch (e) {
      res.render("login", { error: "Email or password wrong" });
    }
  };
}
