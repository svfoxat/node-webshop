import { Knex } from "knex";
import { User } from "../src/model/user";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("user").del();

  // Inserts seed entries
  const users: User[] = [
    {
      id: "1",
      email: "test@store.at",
      password: "$2b$10$KpPLIKf8oNp/z9OweFTh8uUk7hcylloD9TdsO6UTSlwvsIzaBYtqO", // "hallo"
    },
    {
      id: "2",
      email: "user@store.at",
      password: "$2b$10$KpPLIKf8oNp/z9OweFTh8uUk7hcylloD9TdsO6UTSlwvsIzaBYtqO", // "hallo"
    },
  ];
  await knex("user").insert(users);
}
