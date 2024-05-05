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

export class ShoppingCartRepository {
  public static async readById(
    id: string,
    db: mysql.Connection,
  ): Promise<ShoppingCart> {
    const [rows] = await db.query("SELECT * FROM shopping_cart WHERE id = ?", [
      id,
    ]);
    const cart = (rows as ShoppingCart[])[0];
    cart.item_count = await this.readItemCount(cart.id, db);
    return cart;
  }

  public static async readByUserId(
    userId: string,
    db: mysql.Connection,
  ): Promise<ShoppingCart> {
    const [rows] = await db.query(
      "SELECT * FROM shopping_cart WHERE user_id = ?",
      [userId],
    );
    const cart = (rows as ShoppingCart[])[0];
    if (cart) {
      cart.item_count = await this.readItemCount(cart.id, db);
    }
    return cart;
  }

  public static async readCartSum(
    cartId: string,
    db: mysql.Connection,
  ): Promise<number> {
    const [rows] = await db.query(
      "SELECT SUM(price*quantity) as sum  FROM shopping_cart_item as i INNER JOIN product as p ON i.product_id=p.id WHERE i.shopping_cart_id = ?",
      [cartId],
    );
    return (rows as { sum: number }[])[0].sum;
  }

  public static async readItemCount(
    id: string,
    db: mysql.Connection,
  ): Promise<number> {
    const [rows] = await db.query(
      "SELECT COUNT(id) AS `count` FROM shopping_cart_item WHERE shopping_cart_id = ?",
      [id],
    );
    return (rows as { count: number }[])[0].count;
  }

  public static async getItemsForCart(
    cartId: string,
    db: mysql.Connection,
  ): Promise<ShoppingCartItemWithProduct[]> {
    const [rows] = await db.query(
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

  public static async removeItemFromCart(
    cart_id: string,
    item_id: string,
    db: mysql.Connection,
  ): Promise<void> {
    await db.query(
      "DELETE FROM shopping_cart_item WHERE shopping_cart_id = ? AND id = ?",
      [cart_id, item_id],
    );
  }

  public static async addItemToCart(
    cart_id: string,
    product_id: string,
    quantity: number,
    db: mysql.Connection,
  ): Promise<void> {
    await db.query(
      "INSERT INTO shopping_cart_item (shopping_cart_id, product_id, quantity) VALUES (?, ?, ?)",
      [cart_id, product_id, quantity],
    );
  }

  public static async findCartItemForProduct(
    cartId: string,
    productId: string,
    db: mysql.Connection,
  ): Promise<ShoppingCartItem | null> {
    const [rows] = await db.query(
      "SELECT * FROM shopping_cart_item WHERE shopping_cart_id = ? AND product_id = ?",
      [cartId, productId],
    );
    if ((rows as any[]).length === 0) {
      return null;
    }
    return (rows as ShoppingCartItem[])[0];
  }

  public static async writeCartItemQuantity(
    cartItemId: string,
    quantity: number,
    db: mysql.Connection,
  ): Promise<void> {
    await db.query("UPDATE shopping_cart_item SET quantity = ? WHERE id = ?", [
      quantity,
      cartItemId,
    ]);
  }

  public static async write(
    cart: ShoppingCart,
    db: mysql.Connection,
  ): Promise<string> {
    await db.query("INSERT INTO shopping_cart (user_id) VALUES (?)", [
      cart.user_id,
    ]);

    // read back
    const [result] = await db.query(
      "SELECT id FROM shopping_cart WHERE id = LAST_INSERT_ID()",
    );
    return (result as { id: string }[])[0].id;
  }
}
