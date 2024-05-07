import "dotenv/config";
import mysql from "mysql2/promise";
import { initLogger } from "../../src/logger";
import { initDatabase } from "../../src/database";
import CartService from "../../src/service/cart";
import { MysqlShoppingCartStore } from "../../src/model/shopping_cart";

describe("Testing CartService", () => {
  let dbConn: mysql.Connection;
  let service: CartService;

  beforeAll(async () => {
    const logger = initLogger();
    dbConn = await initDatabase(logger);
    service = new CartService(new MysqlShoppingCartStore(dbConn), logger);
  });

  afterAll(async () => {
    dbConn.end();
  });

  test("getAnonymousCart: add and remove from anonymous cart", async () => {
    const cart = await service.getAnonymousCart();
    expect(cart.item_count).toBe(0);
    expect(cart.id).toBeTruthy();

    // the first product from the seeds (seeds/product.ts)
    await service.addProductToCart("1", 1, cart.id as string);
    const cartWithProduct = await service.getAnonymousCart(cart.id);
    expect(cartWithProduct.item_count).toBe(1);

    const itemsInCart = await service.getItemsForCart(cart.id as string);
    expect(itemsInCart.length).toBe(1);
    expect(itemsInCart[0].quantity).toBe(1);

    await service.addProductToCart("1", 2, cart.id as string);
    const itemsInCart2 = await service.getItemsForCart(cart.id as string);
    expect(itemsInCart2.length).toBe(1);
    expect(itemsInCart2[0].quantity).toBe(3);

    await service.removeItemFromCart(
      cart.id as string,
      itemsInCart[0].id as string,
    );
    const emptyCart = await service.getAnonymousCart(cart.id as string);
    expect(emptyCart.item_count).toBe(0);
  });

  test("getCartForUser: add and remove from user cart", async () => {
    // user id 1 is test@store.at (seeds/users.ts)
    const cart = await service.getCartForUser("1");
    expect(cart.id).toBeTruthy();

    // the first product from the seeds (seeds/product.ts)
    await service.addProductToCart("1", 1, cart.id as string);
    const cartWithProduct = await service.getCartForUser("1");
    expect(cartWithProduct.item_count).toBe(1);

    const itemsInCart = await service.getItemsForCart(cart.id as string);
    expect(itemsInCart.length).toBe(1);
    expect(itemsInCart[0].quantity).toBe(1);

    await service.addProductToCart("1", 2, cart.id as string);
    const itemsInCart2 = await service.getItemsForCart(cart.id as string);
    expect(itemsInCart2.length).toBe(1);
    expect(itemsInCart2[0].quantity).toBe(3);

    await service.removeItemFromCart(
      cart.id as string,
      itemsInCart[0].id as string,
    );
    const emptyCart = await service.getCartForUser("1");
    expect(emptyCart.item_count).toBe(0);
  });
});
