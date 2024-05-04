import { Knex } from "knex";
import { Product } from "../src/model/product";

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("https://fakestoreapi.com/products");
  let json = await res.json();

  let products: Product[] = [];
  for (const p of json) {
    products.push({
      id: p.id,
      name: p.title,
      description: p.description,
      price: p.price,
      image_url: p.image,
    });
  }
  return products;
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("product").del();

  // Inserts seed entries
  const products = await fetchProducts();
  await knex("product").insert(products);
}
