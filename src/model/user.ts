import mysql from "mysql2/promise";

export type User = {
  id?: string;
  email: string;
  password: string;
};

export class UserRepository {
  public static async findByEmail(
    email: string,
    db: mysql.Connection,
  ): Promise<User> {
    const [result] = await db.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    return (result as User[])[0];
  }

  public static async findById(
    id: string,
    db: mysql.Connection,
  ): Promise<User> {
    const [result] = await db.query("SELECT * FROM user WHERE id = ?", [id]);
    return (result as User[])[0];
  }

  public static async write(user: User, db: mysql.Connection): Promise<void> {
    await db.query("INSERT INTO user (email, password) VALUES(?, ?)", [
      user.email,
      user.password,
    ]);
  }
}
