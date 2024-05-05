import mysql from "mysql2/promise";
import {
  ShoppingCart,
  ShoppingCartItem,
  ShoppingCartRepository,
} from "../model/shopping_cart";

export default class CartController {
  db: mysql.Connection;

  constructor(db: mysql.Connection) {
    this.db = db;
  }

  public async getCartForUser(userId: string): Promise<ShoppingCart> {
    let cart = await ShoppingCartRepository.readByUserId(userId, this.db);
    if (!cart) {
      const newCart: ShoppingCart = {
        user_id: userId,
        item_count: 0,
        total_sum: 0,
      };
      await ShoppingCartRepository.write(newCart, this.db);
      cart = await ShoppingCartRepository.readByUserId(userId, this.db);
      return cart;
    }

    cart.total_sum = await ShoppingCartRepository.readCartSum(cart.id, this.db);
    return cart;
  }

  public async getItemsForCart(cartId: string): Promise<ShoppingCartItem[]> {
    const items = await ShoppingCartRepository.getItemsForCart(cartId, this.db);
    return items;
  }

  public async addProductToCart(
    product_id: string,
    quantity: number,
    cartId: string,
  ): Promise<void> {
    const cartItem = await ShoppingCartRepository.findCartItemForProduct(
      cartId,
      product_id,
      this.db,
    );

    if (!cartItem) {
      await ShoppingCartRepository.addItemToCart(
        cartId,
        product_id,
        quantity,
        this.db,
      );
      return;
    }

    const newQuantity = cartItem.quantity + quantity;
    await ShoppingCartRepository.writeCartItemQuantity(
      cartItem.id,
      newQuantity,
      this.db,
    );
  }

  public async removeItemFromCart(cart_id: string, item_id: string) {
    await ShoppingCartRepository.removeItemFromCart(cart_id, item_id, this.db);
  }
}
