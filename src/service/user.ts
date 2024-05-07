import { User, UserStore } from "../model/user";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export default class UserController {
  constructor(private store: UserStore) {}

  public async create(email: string, password: string): Promise<User> {
    const existing = await this.store.findByEmail(email);
    if (existing) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.hashPassword(password);
    const user: User = {
      email: email,
      password: hashedPassword,
    };
    await this.store.write(user);
    return await this.store.findById(user.email);
  }

  public async login(email: string, password: string): Promise<User> {
    const user = await this.store.findByEmail(email);
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
