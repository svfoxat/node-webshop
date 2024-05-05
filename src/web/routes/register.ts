import { RouteConfig } from "../router";
import express from "express";

export function GETRegisterRoute(config: RouteConfig) {
  return async function (req: express.Request, res: express.Response) {
    res.render("register", { error: null, success: null });
  };
}

export function POSTRegisterRoute(config: RouteConfig) {
  return async function (req: express.Request, res: express.Response) {
    if (req.body.password !== req.body.password_repeat) {
      res.render("register", {
        error: "Passwords do not match!",
      });
    }

    try {
      await config.users.create(req.body.email, req.body.password);
      res.render("register", {
        success: "Your user was created",
      });
    } catch (e) {
      res.render("register", {
        error: "A user with this email already exists.",
      });
    }
  };
}
