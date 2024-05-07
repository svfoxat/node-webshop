import "dotenv/config";
import mysql from "mysql2/promise";
import { initLogger } from "../../src/logger";
import { initDatabase } from "../../src/database";
import ProductService from "../../src/service/product";
import { MysqlProductStore } from "../../src/model/product";

describe("Testing ProductService", () => {
  let dbConn: mysql.Connection;
  let service: ProductService;

  beforeAll(async () => {
    const logger = initLogger();
    dbConn = await initDatabase(logger);
    service = new ProductService(new MysqlProductStore(dbConn), logger);
  });

  afterAll(async () => {
    dbConn.end();
  });

  test("readMany: limit 20, offset 0", async () => {
    const products = await service.readMany(0, 20);
    expect(products.length).toEqual(20);
  });

  test("readMany: limit 1, offset 0", async () => {
    const products = await service.readMany(0, 1);
    expect(products.length).toEqual(1);
  });
  test("readMany: limit 20, offset 5", async () => {
    const products = await service.readMany(5, 20);
    expect(products.length).toEqual(15);
  });
});
