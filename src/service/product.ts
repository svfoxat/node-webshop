import { Product } from "../model/product";
import { ProductStore } from "../model/product";

export default class ProductService {
  constructor(private store: ProductStore) {}

  readMany(limit: number, offset: number): Promise<Product[]> {
    return this.store.readMany(limit, offset);
  }
}
