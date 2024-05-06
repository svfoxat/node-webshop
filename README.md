# node-webshop

## Prerequisites

- `node >= 20`
- `yarn`
- `docker`

## Development

1. `yarn install`
2. `docker-compose up -d`
3. `npx knex migrate:up`
4. `npx knex seed:run`
5. `yarn dev`

## Overview

### Data model

![ER Diagram](https://github.com/svfoxat/node-webshop/blob/master/er.png?raw=true)

#### Notes

- FK `user_id` in `shopping_cart` table is nullable to allow anonymous shopping carts
- PKs are autoincrementing unsigned ints, maybe switch to uuids
  - mysql supported generation with `UUID()`
  - help prevent enumeration attacks on users/orders/...
