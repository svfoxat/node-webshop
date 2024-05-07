import mysql from "mysql2/promise";
import winston from "winston";

export async function initDatabase(
  logger: winston.Logger,
): Promise<mysql.Connection> {
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
