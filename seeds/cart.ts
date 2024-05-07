import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("shopping_cart").del();
  await knex("shopping_cart_item").del();

  // Inserts seed entries
  // const carts = []
  // await knex("user").insert(carts);
}
