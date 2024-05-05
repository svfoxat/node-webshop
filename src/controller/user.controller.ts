import { User, UserRepository } from "../model/user";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export default class UserController {
  db: mysql.Connection;

  constructor(db: mysql.Connection) {
    this.db = db;
  }

  public async create(email: string, password: string): Promise<User> {
    const existing = await UserRepository.findByEmail(email, this.db);
    if (existing) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.hashPassword(password);
    const user: User = {
      email: email,
      password: hashedPassword,
    };
    await UserRepository.write(user, this.db);
    return await UserRepository.findById(user.email, this.db);
  }

  public async login(email: string, password: string): Promise<User> {
    const user = await UserRepository.findByEmail(email, this.db);
    if (!user) return null;

    if (this.comparePassword(password, user.password)) {
      return user;
    } else return null;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }
  private async comparePassword(
    cleartext: string,
    hashed: string,
  ): Promise<boolean> {
    return bcrypt.compare(cleartext, hashed);
  }
}
