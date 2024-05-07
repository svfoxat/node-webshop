import mysql from "mysql2/promise";
import {
  ShoppingCart,
  ShoppingCartItem,
  ShoppingCartStore,
} from "../model/shopping_cart";

export default class CartService {
  constructor(public store: ShoppingCartStore) {}

  public async getCartForUser(userId: string): Promise<ShoppingCart> {
    let cart = await this.store.readByUserId(userId);
    if (!cart) {
      const newCart: ShoppingCart = {
        user_id: userId,
        item_count: 0,
        total_sum: 0,
      };
      const cartId = await this.store.write(newCart);
      cart = await this.store.readByUserId(cartId);
      return cart;
    }

    cart.total_sum = await this.store.readCartSum(cart.id);
    return cart;
  }

  public async getAnonymousCart(cart_id?: string): Promise<ShoppingCart> {
    let cart = null;

    if (cart_id) cart = await this.store.readById(cart_id);

    if (!cart) {
      const newCart: ShoppingCart = {
        item_count: 0,
        total_sum: 0,
      };
      const cartId = await this.store.write(newCart);
      cart = await this.store.readById(cartId);
      return cart;
    }

    cart.total_sum = await this.store.readCartSum(cart.id);
    console.log(cart);
    return cart;
  }

  public async getItemsForCart(cartId: string): Promise<ShoppingCartItem[]> {
    const items = await this.store.getItemsForCart(cartId);
    return items;
  }

  public async addProductToCart(
    product_id: string,
    quantity: number,
    cartId: string,
  ): Promise<void> {
    const cartItem = await this.store.findCartItemForProduct(
      cartId,
      product_id,
    );

    if (!cartItem) {
      await this.store.addItemToCart(cartId, product_id, quantity);
      return;
    }

    const newQuantity = cartItem.quantity + quantity;
    await this.store.writeCartItemQuantity(cartItem.id, newQuantity);
  }

  public async removeItemFromCart(cart_id: string, item_id: string) {
    await this.store.removeItemFromCart(cart_id, item_id);
  }
}
