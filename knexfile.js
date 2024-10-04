module.exports = {
  client: 'pg',
  connection: {
    host: 'localhost', // Update with your database host
    user: 'your_username', // Update with your database user
    password: 'your_password', // Update with your database password
    database: 'your_database', // Update with your database name
  },
  migrations: {
    directory: './migrations', // Ensure this path matches your migrations directory
  },
  seeds: {
    directory: './seeders', // Ensure this path matches your seeders directory
  },
};
