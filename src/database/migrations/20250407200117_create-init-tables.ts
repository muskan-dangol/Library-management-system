import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create extensions uuid-ossp
  await knex.raw(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    
  `);

  // Create table user
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "user" (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT,
      firstname TEXT,
      lastname TEXT,
      password TEXT,
      is_admin BOOLEAN NOT NULL DEFAULT false,
      created_on TIMESTAMPTZ(0) NOT NULL DEFAULT NOW(),
      UNIQUE (email)
    );
  `);

  await knex.raw(`
    CREATE TABLE If NOT EXISTS "book" (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT,
      author TEXT,
      release_date DATE,
      available INTEGER,
      short_description TEXT,
      long_description TEXT,
      image TEXT,
      created_on TIMESTAMPTZ(0) NOT NULL DEFAULT NOW(),
      UNIQUE (title, image)
    );
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "category" (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT
    );
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "book_category" (
      book_id UUID NOT NULL,
      category_id UUID NOT NULL,
      PRIMARY KEY (book_id, category_id),
      FOREIGN KEY (book_id) REFERENCES "book"(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES "category"(id) ON DELETE CASCADE
    );
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "cart" (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      created_on TIMESTAMPTZ(0) NOT NULL DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
    );
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "cart_item" (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      book_id UUID NOT NULL,
      quantity INTEGER DEFAULT 1,
      created_on TIMESTAMPTZ(0) NOT NULL DEFAULT NOW(),
      updated_on TIMESTAMPTZ(0),
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES "book"(id) ON DELETE CASCADE,
      UNIQUE (book_id, user_id)
    );
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "reservation" (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      book_id UUID NOT NULL,
      start_date TIMESTAMPTZ(0),
      end_date TIMESTAMPTZ(0),
      status TEXT,
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES "book"(id) ON DELETE CASCADE
    );
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "review" (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      book_id UUID NOT NULL,
      comment TEXT,
      rating INTEGER,
      created_on TIMESTAMPTZ(0) NOT NULL DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES "book"(id) ON DELETE CASCADE
    );
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "reply" (
      user_id UUID NOT NULL,
      review_id UUID NOT NULL,
      comment TEXT,
      created_on TIMESTAMPTZ(0) NOT NULL DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
      FOREIGN KEY (review_id) REFERENCES "review"(id) ON DELETE CASCADE
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS "user" CASCADE;
    DROP TABLE IF EXISTS "book" CASCADE;
    DROP TABLE IF EXISTS "category" CASCADE;
    DROP TABLE IF EXISTS "book_category" CASCADE;
    DROP TABLE IF EXISTS "cart" CASCADE;
    DROP TABLE IF EXISTS "cart_item" CASCADE;
    DROP TABLE IF EXISTS "reservation" CASCADE;
    DROP TABLE IF EXISTS "review" CASCADE;
    DROP TABLE IF EXISTS "reply" CASCADE;
  `);
}
