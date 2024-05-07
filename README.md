# node-webshop

## Prerequisites

- `node >= 20`
- `yarn`
- `docker`

## Technologies

- `node`
- `mysql`
- `express` as http server
- `pug` for templating
- `htmx` for interactivity
- `materialize` for a bit of style

## Disclamer

The seed script (`seed/products.ts`) fetches 20 products from `https://fakestoreapi.com/products`

## Development

1. `yarn install`
2. `docker-compose up -d`
3. `npx knex migrate:up`
4. `npx knex seed:run`
5. `yarn dev`

### Database state

`npx knex seed:run` resets all tables and their contents to the initial seeds in `seeds/*.ts`

## Overview

### Data model

![ER Diagram](https://github.com/svfoxat/node-webshop/blob/master/er.png?raw=true)

#### Notes

- `email` in `user` table should be unique, would save reads on register
- FK `user_id` in `shopping_cart` table is nullable to allow anonymous shopping carts
- PKs are autoincrementing unsigned ints, maybe switch to uuids
  - mysql supported generation with `UUID()`
  - help prevent enumeration attacks on users/orders/...
