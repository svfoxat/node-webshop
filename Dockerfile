FROM node:20 as builder
WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]
RUN ["yarn", "install"]

COPY ["tsconfig.json", "."]
COPY ["src/", "./src"]
RUN ["yarn", "build"]


FROM node:20-alpine as runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY ["views/", "./views"]
COPY ["public/", "./public/"]
COPY ["package.json", "yarn.lock", "./"]
RUN ["yarn", "install", "--production"]

ENTRYPOINT [ "node", "dist/server.js" ]
EXPOSE 4000
