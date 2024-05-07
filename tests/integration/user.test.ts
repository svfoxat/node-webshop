import "dotenv/config";
import mysql from "mysql2/promise";
import { initLogger } from "../../src/logger";
import { initDatabase } from "../../src/database";
import UserService from "../../src/service/user";
import { MysqlUserStore } from "../../src/model/user";
import { randomInt } from "crypto";

describe("Testing UserService", () => {
  let dbConn: mysql.Connection;
  let service: UserService;

  beforeAll(async () => {
    const logger = initLogger();
    dbConn = await initDatabase(logger);
    service = new UserService(new MysqlUserStore(dbConn), logger);
  });

  afterAll(async () => {
    dbConn.end();
  });

  test("create: new user", async () => {
    const email = `test-${randomInt(100_000_000)}@store.at`;
    const user = await service.create(email, "testpassword");
    expect(user.email).toEqual(email);
  });

  // user is already existing in the seeds (seeds/user.ts)
  test("create: create user with already existing email", async () => {
    return service
      .create("test@store.at", "testpassword")
      .then((user) => {
        expect(user).toBe(undefined);
      })
      .catch((err) =>
        expect(err.toString()).toBe("Error: User already exists"),
      );
  });

  // user is already existing in the seeds (seeds/user.ts)
  test("login: login with existing user", async () => {
    const user = await service.login("test@store.at", "password");
    expect(user.email).toEqual("test@store.at");
  });

  // user is already existing in the seeds (seeds/user.ts)
  test("login: login with wrong password", async () => {
    return service
      .login("test@store.at", "asdfs")
      .catch((e) => {
        expect(e.toString()).toBe(
          "Error: user with test@store.at failed to login due password mismatch",
        );
      })
      .then((user) => {
        expect(user).toBe(undefined);
      });
  });

  test("login: login with not-existing user", async () => {
    return service
      .login("nonexistent@store.at", "hallo")
      .catch((e) => {
        expect(e.toString()).toBe(
          "Error: user with nonexistent@store.at not found",
        );
      })
      .then((user) => {
        expect(user).toBe(undefined);
      });
  });
});
