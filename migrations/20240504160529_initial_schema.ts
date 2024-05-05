import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return (
    knex.schema
      .createTable("user", (table) => {
        table.increments("id").primary();
        table.string("email", 255).notNullable();
        table.string("password").notNullable();
      })
      // .createTable("session", (table) => {
      //   table.increments("id").primary();
      //   table
      //     .integer("user_id")
      //     .unsigned()
      //     .references("user.id")
      //     .onDelete("CASCADE");
      //   table.string("token").notNullable();
      //   table.timestamp("expires_at").notNullable();
      // })
      .createTable("product", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.text("description").notNullable();
        table.decimal("price");
        table.string("image_url");
      })
      .createTable("shopping_cart", (table) => {
        table.increments("id").primary();
        table
          .integer("user_id")
          .unsigned()
          .references("user.id")
          .onDelete("CASCADE");
      })
      .createTable("shopping_cart_item", (table) => {
        table.increments("id").primary();
        table
          .integer("shopping_cart_id")
          .unsigned()
          .references("shopping_cart.id")
          .onDelete("CASCADE");
        table.integer("product_id").unsigned().references("product.id");
        table.integer("quantity").notNullable();
      })
  );
}

export async function down(knex: Knex): Promise<void> {
  return (
    knex.schema
      .dropTable("shopping_cart_item")
      .dropTable("shopping_cart")
      .dropTable("product")
      // .dropTable("session")
      .dropTable("user")
  );
}
