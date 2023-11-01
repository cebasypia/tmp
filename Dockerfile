FROM node:17.9.1-alpine3.15 AS builder

# 作業ディレクトリを作成する
WORKDIR /work

COPY ./package*.json ./

RUN npm ci

COPY ./tsconfig*.json ./

COPY ./src ./src

RUN npm run build

FROM node:17.9.1-alpine3.15

ENV NODE_ENV=production

RUN apk add --no-cache tini
# アプリケーションディレクトリを作成する
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY --from=builder /work/dist ./dist

# 開放するport番号を記載
EXPOSE 3001

ENTRYPOINT [ "/sbin/tini","--", "node", "dist/index.js" ]