import winston from "winston";
import { Product } from "../model/product";
import { ProductStore } from "../model/product";

export default class ProductService {
  private logger: winston.Logger;

  constructor(
    private store: ProductStore,
    logger: winston.Logger,
  ) {
    this.logger = logger.child({ service: "ProductServicet" });
  }

  readMany(offset: number, limit: number): Promise<Product[]> {
    return this.store.readMany(offset, limit);
  }
}
