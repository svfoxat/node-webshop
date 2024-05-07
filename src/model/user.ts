import mysql from "mysql2/promise";

export type User = {
  id?: string;
  email: string;
  password: string;
};

export interface UserStore {
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  write(user: User): Promise<void>;
}

export class MysqlUserStore {
  constructor(private db: mysql.Connection) {}

  public async findByEmail(email: string): Promise<User> {
    const [result] = await this.db.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    return (result as User[])[0];
  }

  public async findById(id: string): Promise<User> {
    const [result] = await this.db.query("SELECT * FROM user WHERE id = ?", [
      id,
    ]);
    return (result as User[])[0];
  }

  public async write(user: User): Promise<void> {
    await this.db.query("INSERT INTO user (email, password) VALUES(?, ?)", [
      user.email,
      user.password,
    ]);
  }
}
