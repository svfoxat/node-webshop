import winston from "winston";

export function initLogger(): winston.Logger {
  const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    defaultMeta: { application: "node-webshop" },
  });

  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize()),
    }),
  );

  return logger;
}
