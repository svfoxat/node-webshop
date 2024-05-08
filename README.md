# node-webshop

## Prerequisites

- `node >= 20.9.0`
- `yarn`
- `docker`

## Technologies

- `node`
- `mysql`
- `express` as http server
- `pug` for templating
- `htmx` for interactivity
- `materialize` for a bit of style

## Disclaimer

The seed script (`seed/products.ts`) fetches 20 products from `https://fakestoreapi.com/products`

## Development

1. `yarn install`
2. `docker-compose up -d`
3. `npx knex migrate:up`
4. `npx knex seed:run`
5. `yarn dev`

### docker-compose

- `mysql:8` is started with `docker-compose up -d`
- it's also possible to develop with the commented out app in the `docker-compose.yml`
  - after changes, `docker-compose up -d --build` is needed

### Migrations

- to create a new migration use the [knex cli](https://knexjs.org/guide/migrations.html#migration-cli)
- to apply or revert the latest migrations use
  - `npx knex migrate:up` or `npx knex:migrate down`

### Database seeds

`npx knex seed:run` resets all tables and their contents to the initial seeds in `seeds/*.ts`

## Overview

### Scalability considerations

- Sessions are stored in-memory, so a more persistent way to save and load sessions across instances is recommended

  - sticky sessions could also be a way but then the load wouldn't be evenly distributed across instances
  - if that instance would go down, so goes the session

- Shopping carts are transient and could be moved to another storage (e.g. `redis`) and then persisted to a better suited archival store after the end of the user/anonymous session for analytics purposes

- Static assets like product images can be offloaded to a CDN to reduce the load on the instances
- Products can also be cached and then get invalidated when they change

- Currently one instance uses one connection to mysql, to perform better under higher concurrency a pooled connection should be used

- As this is a fully server rendered application, it is not possible to cache API requests in the frontend
  - Caching has to be done on the data-layer, either as a look-aside or inline cache

### Data model

![ER Diagram](https://github.com/svfoxat/node-webshop/blob/master/er.png?raw=true)

#### Notes

- `email` in `user` table should be unique, would save reads on register and guarantees uniqueness on the DB layer
- FK `user_id` in `shopping_cart` table is nullable to allow anonymous shopping carts
- PKs are autoincrementing unsigned ints, maybe switch to uuids
  - mysql supported generation with `UUID()`
  - help prevent enumeration attacks on users/orders/...
