import mysql from "mysql2/promise";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

export class ProductRepository {
  public static async read(id: string, db: mysql.Connection): Promise<Product> {
    const [rows] = await db.query("SELECT * FROM product WHERE id = ?", [id]);
    return (rows as Product[])[0];
  }
  public static async readMany(
    offset: number,
    limit: number,
    db: mysql.Connection,
  ): Promise<Product[]> {
    const [rows, fields] = await db.query(
      "SELECT * FROM product LIMIT ? OFFSET ?",
      [limit, offset],
    );
    return rows as Product[];
  }
}
