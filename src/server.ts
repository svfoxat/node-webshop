import "dotenv/config";

import express from "express";
import winston from "winston";
import winstonMiddleware from "express-winston";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import { WebRouter } from "./web/router";

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
  app.set("view engine", "pug");

  app.use("/", new WebRouter({ db: db }).router);
  // app.use("/api/v1", new ApiRouter({ db: db }).router);

  app.listen(process.env.PORT, () => {
    logger.info(`http server running on port ${process.env.PORT}`);
  });
}

Server();

async function initDatabase(logger: winston.Logger): Promise<mysql.Connection> {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
  });
  await connection.connect();
  await connection.query("SELECT 1");
  logger.log("info", "mysql connection established");
  return connection;
}

function initLogger(): winston.Logger {
  const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  });

  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize()),
    }),
  );

  return logger;
}
