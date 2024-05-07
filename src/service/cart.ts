import {
  ShoppingCart,
  ShoppingCartItem,
  ShoppingCartStore,
} from "../model/shopping_cart";
import winston from "winston";

export default class CartService {
  private logger: winston.Logger;

  constructor(
    private store: ShoppingCartStore,
    logger: winston.Logger,
  ) {
    this.logger = logger.child({ service: "CartService" });
  }

  public async getCartForUser(userId: string): Promise<ShoppingCart> {
    this.logger.debug(`read cart for user ${userId}`);
    let cart = await this.store.readByUserId(userId);
    if (!cart) {
      this.logger.log("debug", `creating new cart for user ${userId}`);
      const newCart: ShoppingCart = {
        user_id: userId,
        item_count: 0,
        total_sum: 0,
      };
      await this.store.write(newCart);
      cart = await this.store.readByUserId(userId);
      return cart;
    }

    this.logger.debug(`found cart for user ${userId}`);
    cart.total_sum = await this.store.readCartSum(cart.id);
    return cart;
  }

  public async getAnonymousCart(cart_id?: string): Promise<ShoppingCart> {
    this.logger.debug(`read anonymous cart with id: ${cart_id}`);
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
    return cart;
  }

  public async getItemsForCart(cartId: string): Promise<ShoppingCartItem[]> {
    this.logger.debug(`get items for cart with id: ${cartId}`);
    const items = await this.store.getItemsForCart(cartId);
    return items;
  }

  public async addProductToCart(
    product_id: string,
    quantity: number,
    cartId: string,
  ): Promise<void> {
    this.logger.debug(`add product ${product_id} to cart ${cartId}`);
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
    this.logger.debug(`remove product ${item_id} from cart ${cart_id}`);
    await this.store.removeItemFromCart(cart_id, item_id);
  }
}
