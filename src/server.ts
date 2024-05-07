import "dotenv/config";

import express from "express";
import winstonMiddleware from "express-winston";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import { WebRouter } from "./web/router";
import { initLogger } from "./logger";
import { initDatabase } from "./database";

async function Server() {
  const logger = initLogger();

  const db = await initDatabase(logger);

  const app = express();
  app.use(
    winstonMiddleware.logger({
      winstonInstance: logger,
      meta: false,
      msg: "HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
      expressFormat: true,
      colorize: false,
    }),
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    cookieSession({
      name: "session",
      secret: process.env.COOKIE_SECRET,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    }),
  );
  app.set("view engine", "pug");

  app.use(express.static("public"));
  app.use("/", new WebRouter({ db: db, logger: logger }).router);
  // app.use("/api/v1", new ApiRouter({ db: db }).router);

  app.listen(process.env.PORT || 4000, () => {
    logger.info(`http server running on port ${process.env.PORT || 4000}`);
  });
}

Server();
