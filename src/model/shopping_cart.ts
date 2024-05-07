import mysql from "mysql2/promise";
import { Product } from "./product";

export type ShoppingCart = {
  id?: string;
  user_id?: string;
  item_count?: number;
  total_sum?: number;
};

export type ShoppingCartItem = {
  id?: string;
  shopping_cart_id: string;
  product_id: string;
  quantity: number;
};

export type ShoppingCartItemWithProduct = ShoppingCartItem & {
  product?: Product;
};

export interface ShoppingCartStore {
  write(cart: ShoppingCart): Promise<string>;
  readById(id: string): Promise<ShoppingCart>;
  readByUserId(userId: string): Promise<ShoppingCart>;
  readCartSum(cartId: string): Promise<number>;
  readItemCount(id: string): Promise<number>;
  getItemsForCart(cartId: string): Promise<ShoppingCartItemWithProduct[]>;
  removeItemFromCart(cart_id: string, item_id: string): Promise<void>;
  addItemToCart(
    cart_id: string,
    product_id: string,
    quantity: number,
  ): Promise<void>;
  findCartItemForProduct(
    cartId: string,
    productId: string,
  ): Promise<ShoppingCartItem | null>;
  writeCartItemQuantity(cartItemId: string, quantity: number): Promise<void>;
}

export class MysqlShoppingCartStore implements ShoppingCartStore {
  constructor(private db: mysql.Connection) {}

  public async readById(id: string): Promise<ShoppingCart> {
    const [rows] = await this.db.query(
      "SELECT * FROM shopping_cart WHERE id = ?",
      [id],
    );
    const cart = (rows as ShoppingCart[])[0];
    cart.item_count = await this.readItemCount(cart.id);
    return cart;
  }

  public async readByUserId(userId: string): Promise<ShoppingCart> {
    const [rows] = await this.db.query(
      "SELECT * FROM shopping_cart WHERE user_id = ?",
      [userId],
    );
    const cart = (rows as ShoppingCart[])[0];
    if (cart) {
      cart.item_count = await this.readItemCount(cart.id);
    }
    return cart;
  }

  public async readCartSum(cartId: string): Promise<number> {
    const [rows] = await this.db.query(
      "SELECT SUM(price*quantity) as sum  FROM shopping_cart_item as i INNER JOIN product as p ON i.product_id=p.id WHERE i.shopping_cart_id = ?",
      [cartId],
    );
    return (rows as { sum: number }[])[0].sum;
  }

  public async readItemCount(id: string): Promise<number> {
    const [rows] = await this.db.query(
      "SELECT COUNT(id) AS `count` FROM shopping_cart_item WHERE shopping_cart_id = ?",
      [id],
    );
    return (rows as { count: number }[])[0].count;
  }

  public async getItemsForCart(
    cartId: string,
  ): Promise<ShoppingCartItemWithProduct[]> {
    const [rows] = await this.db.query(
      "SELECT i.*, p.id as p_id, p.name as p_name, p.price as p_price, p.image_url as p_image_url, p.price * i.quantity as sum  from shopping_cart_item as i INNER JOIN product as p WHERE i.shopping_cart_id = ? AND i.product_id=p.id;",
      [cartId],
    );
    let items: ShoppingCartItemWithProduct[] = [];

    items = (rows as any[]).map((r) => ({
      ...r,
      product: {
        id: r.p_id,
        name: r.p_name,
        price: r.p_price,
        image_url: r.p_image_url,
      },
    }));
    return items;
  }

  public async removeItemFromCart(
    cart_id: string,
    item_id: string,
  ): Promise<void> {
    await this.db.query(
      "DELETE FROM shopping_cart_item WHERE shopping_cart_id = ? AND id = ?",
      [cart_id, item_id],
    );
  }

  public async addItemToCart(
    cart_id: string,
    product_id: string,
    quantity: number,
  ): Promise<void> {
    await this.db.query(
      "INSERT INTO shopping_cart_item (shopping_cart_id, product_id, quantity) VALUES (?, ?, ?)",
      [cart_id, product_id, quantity],
    );
  }

  public async findCartItemForProduct(
    cartId: string,
    productId: string,
  ): Promise<ShoppingCartItem | null> {
    const [rows] = await this.db.query(
      "SELECT * FROM shopping_cart_item WHERE shopping_cart_id = ? AND product_id = ?",
      [cartId, productId],
    );
    if ((rows as any[]).length === 0) {
      return null;
    }
    return (rows as ShoppingCartItem[])[0];
  }

  public async writeCartItemQuantity(
    cartItemId: string,
    quantity: number,
  ): Promise<void> {
    await this.db.query(
      "UPDATE shopping_cart_item SET quantity = ? WHERE id = ?",
      [quantity, cartItemId],
    );
  }

  public async write(cart: ShoppingCart): Promise<string> {
    await this.db.query("INSERT INTO shopping_cart (user_id) VALUES (?)", [
      cart.user_id,
    ]);

    // read back
    const [result] = await this.db.query(
      "SELECT id FROM shopping_cart WHERE id = LAST_INSERT_ID()",
    );
    return (result as { id: string }[])[0].id;
  }
}
