# Library Management System

A RESTful API for managing a library system built with Node.js, TypeScript, and PostgreSQL. It supports user authentication, book cataloguing, category management, cart operations, reservations, reviews, and more.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Running Tests](#running-tests)

## Features

- **User Authentication** – JWT-based signup and login using Passport.js
- **Book Management** – Add, update, delete, and retrieve books; filter by category
- **Category Management** – Organize books into multiple categories (many-to-many)
- **Shopping Cart** – Per-user carts with add/remove/update item support
- **Reservations** – Reserve books with configurable loan periods and status tracking
- **Reviews & Ratings** – Users can review books with star ratings and comments
- **Replies** – Threaded discussion on reviews
- **Role Support** – Admin and standard user roles

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5.x |
| Runtime | Node.js |
| Framework | Express.js 5.x |
| Database | PostgreSQL |
| Query Builder | Knex.js |
| Authentication | Passport.js (Local + JWT) |
| Password Hashing | bcryptjs |
| Testing | Jest + Supertest |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (v13 or higher recommended)
- npm

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/muskan-dangol/Library-management-system.git
   cd Library-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the values in `.env` (see [Environment Variables](#environment-variables)).

4. **Run database migrations**

   ```bash
   npm run migrate
   ```

5. **(Optional) Seed the database**

   ```bash
   npm run seed
   ```

6. **Start the development server**

   ```bash
   npm start
   ```

   The API will be available at `http://localhost:<PORT>` (default port: `3001`).

## Environment Variables

Copy `.env.example` to `.env` and set the following values:

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default: `3001`) |
| `NODE_ENV` | Environment (`development`, `test`, `production`) |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `DB_HOST` | PostgreSQL host for development |
| `DB_USER` | PostgreSQL user for development |
| `DB_NAME` | PostgreSQL database name for development |
| `DB_PASSWORD` | PostgreSQL password for development |
| `DB_PORT` | PostgreSQL port for development (default: `5432`) |
| `DB_HOST_TEST` | PostgreSQL host for test environment |
| `DB_USER_TEST` | PostgreSQL user for test environment |
| `DB_NAME_TEST` | PostgreSQL database name for test environment |
| `DB_PASSWORD_TEST` | PostgreSQL password for test environment |
| `DB_PORT_TEST` | PostgreSQL port for test environment |

## Database Setup

This project uses [Knex.js](https://knexjs.org/) migrations to manage the database schema.

```bash
# Run all pending migrations
npm run migrate

# Run migrations for the test database
npm run migrate:test

# Roll back the last batch of migrations
npm run migrate:rollback

# Roll back all migrations and re-run from scratch
npm run migrate:reset

# Seed the database with sample data
npm run seed
```

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start the server with nodemon |
| `npm run dev` | Start the Express app directly with nodemon |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run migrate` | Run latest database migrations |
| `npm run migrate:test` | Run migrations against the test database |
| `npm run migrate:rollback` | Roll back the last migration batch |
| `npm run migrate:reset` | Roll back all and re-run all migrations |
| `npm run seed` | Seed the database with sample data |
| `npm test` | Run Jest tests |

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT token |

### Users

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users` | Create a user |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:userId` | Get a user by ID |
| `PATCH` | `/api/users/:userId` | Update a user |
| `DELETE` | `/api/users/:userId` | Delete a user |

### Books

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/books` | Add a new book |
| `GET` | `/api/books` | Get all books |
| `GET` | `/api/books/:bookId` | Get a book by ID |
| `PATCH` | `/api/books/:bookId` | Update a book |
| `DELETE` | `/api/books/:bookId` | Delete a book |
| `GET` | `/api/books/category/:categoryId` | Get books by category |

### Categories

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/categories` | Add a new category |
| `GET` | `/api/categories` | Get all categories |
| `GET` | `/api/categories/:categoryId` | Get a category by ID |
| `PATCH` | `/api/categories/:categoryId` | Update a category |
| `DELETE` | `/api/categories/:categoryId` | Delete a category |

### Carts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/carts/:userId` | Get the active cart for a user |

### Cart Items

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/cart-items` | Add or update a cart item |
| `GET` | `/api/cart-items/:cartId` | Get all items in a cart |

### Reservations

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reservations` | Create a reservation |
| `GET` | `/api/reservations/users/:userId` | Get reservations for a user |
| `GET` | `/api/reservations/books/:bookId` | Get reservations for a book |
| `PATCH` | `/api/reservations/:reservationId` | Update a reservation |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reviews` | Add a review |
| `GET` | `/api/reviews/:reviewId` | Get a review by ID |
| `GET` | `/api/reviews/book/:bookId` | Get reviews for a book |
| `GET` | `/api/reviews/user/:userId` | Get reviews by a user |
| `PATCH` | `/api/reviews/:reviewId` | Update a review |
| `DELETE` | `/api/reviews/:reviewId` | Delete a review |

### Replies

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/replies` | Add a reply to a review |
| `GET` | `/api/replies/review/:reviewId` | Get replies for a review |
| `GET` | `/api/replies/:replyId` | Get a reply by ID |
| `PATCH` | `/api/replies/:replyId` | Update a reply |
| `DELETE` | `/api/replies/:replyId` | Delete a reply |

## Database Schema

| Table | Description |
|---|---|
| `user` | Library members and admin accounts |
| `book` | Book catalog with availability tracking |
| `category` | Book genres/categories |
| `book_category` | Many-to-many join table for books and categories |
| `cart` | Per-user shopping carts |
| `cart_item` | Individual items within a cart |
| `reservation` | Book borrowing records with loan period and status |
| `review` | User ratings and comments on books |
| `reply` | Threaded replies to reviews |

## Running Tests

Make sure the test database is configured in `.env` and migrations have been applied:

```bash
npm run migrate:test
npm test
```

Tests use [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest) and run with a 10-second timeout.
