import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const config: Record<string, Knex.Config> = {
  test: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST_TEST,
      database: process.env.DB_NAME_TEST,
      user: process.env.DB_USER_TEST,
      password: process.env.DB_PASSWORD_TEST,
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 20,
      idleTimeoutMillis: 10000,
    },
    migrations: {
      directory: __dirname + "/database/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: __dirname + "/database/seeds",
    },
  },
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 20,
      idleTimeoutMillis: 10000,
    },
    migrations: {
      directory: __dirname + "/database/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: __dirname + "/database/seeds",
    },
  },
  staging: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
