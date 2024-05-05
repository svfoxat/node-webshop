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

![alt text](https://github.com/svfoxat/node-webshop/blob/master/er.png?raw=true)
