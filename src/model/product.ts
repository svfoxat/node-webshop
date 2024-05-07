import mysql from "mysql2/promise";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
};

export interface ProductStore {
  readMany(offset: number, limit: number): Promise<Product[]>;
}

export class MysqlProductStore implements ProductStore {
  constructor(private db: mysql.Connection) {}

  public async readMany(offset: number, limit: number): Promise<Product[]> {
    const [rows] = await this.db.query(
      "SELECT * FROM product LIMIT ? OFFSET ?",
      [limit, offset],
    );
    return rows as Product[];
  }
}
