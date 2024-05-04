import { RouteConfig } from "../router";
import express from "express";

export default function IndexRoute(config: RouteConfig) {
  return function (req: express.Request, res: express.Response) {
    res.render("index", {});
  };
}
