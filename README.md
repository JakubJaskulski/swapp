# SWApi App

## Description

The app retrieves data from external API (https://swapi.dev/), processes it, and caches it in a local database for faster access and reduced API dependency. It ensures data freshness with 24h cache expiration.

## Local setup

```bash
$ docker compose up
```

#### Swagger

```bash
url: http://localhost:3000/api
```

#### pgAdmin

```bash
url: http://localhost:5050/
email: admin@admin.com
password: pgadmin4
```

## Working setup

```bash
$ npm install
```

## Compile and run the project

### PostgreSQL and pgAdmin

```bash
# development with watch mode, using .env.local
$ docker compose --profile local up 
```

```bash
# development with watch mode, using .env.local
$ npm run start:dev
```

## Run tests

```bash
# unit tests
$ npm run test
```
