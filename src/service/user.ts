import winston from "winston";
import { User, UserStore } from "../model/user";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export default class UserService {
  private logger: winston.Logger;

  constructor(
    private store: UserStore,
    logger: winston.Logger,
  ) {
    this.logger = logger.child({ service: "UserService" });
  }

  public async create(email: string, password: string): Promise<User> {
    const existing = await this.store.findByEmail(email);
    if (existing) {
      this.logger.debug(`user with email ${email} already exists`);
      throw new Error("User already exists");
    }

    const hashedPassword = await this.hashPassword(password);
    const user: User = {
      email: email,
      password: hashedPassword,
    };
    await this.store.write(user);
    return this.store.findByEmail(user.email);
  }

  public async login(email: string, password: string): Promise<User> {
    const user = await this.store.findByEmail(email);
    if (!user) {
      this.logger.debug(`user with ${email} not found`);
      throw new Error(`user with ${email} not found`);
    }

    const isValid = await this.comparePassword(password, user.password);
    if (isValid) {
      return user;
    } else {
      this.logger.debug(
        `user with ${email} failed to login due password mismatch`,
      );
      throw new Error(
        `user with ${email} failed to login due password mismatch`,
      );
    }
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
