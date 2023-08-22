require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.POSTGRE_USER,
    "password": process.env.POSTGRE_PASSWORD,
    "database": process.env.POSTGRE_DB,
    "host": "127.0.0.1",
    "dialect": "postgres",
    "port": process.env.POSTGRE_PORT
  },
  "test": {
    "username": process.env.POSTGRE_USER,
    "password": process.env.POSTGRE_PASSWORD,
    "database": process.env.POSTGRE_DB,
    "host": "127.0.0.1",
    "dialect": "postgres",
    "port": process.env.POSTGRE_PORT
  },
  "production": {
    "username": process.env.POSTGRE_USER,
    "password": process.env.POSTGRE_PASSWORD,
    "database": process.env.POSTGRE_DB,
    "host": "127.0.0.1",
    "dialect": "postgres",
    "port": process.env.POSTGRE_PORT
  }
}