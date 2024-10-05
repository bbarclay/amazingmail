# Setting up pg-mem for PostgreSQL Development

## Installation

To install the `pg-mem` package, run the following command:

```bash
npm install pg-mem
```

## Usage

After installing, you can use `pg-mem` to create an in-memory PostgreSQL database for testing and development. Here is a basic example of how to set it up:

```javascript
const { newDb } = require('pg-mem');

// Create a new in-memory database
const db = newDb();

// Create a table
db.public.none('CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT)');

// Insert data
db.public.none('INSERT INTO users (name) VALUES ($1)', ['Alice']);
db.public.none('INSERT INTO users (name) VALUES ($1)', ['Bob']);

// Query data
const users = db.public.many('SELECT * FROM users');
console.log(users);
```

## Conclusion

Using `pg-mem` allows you to test your PostgreSQL functionality without needing a live database. This can speed up your development process and make testing easier.
