require('dotenv').config();

module.exports = {
  "development": {
    "url": process.env.POSTGRES_URL
  },
  "test": {
    "url": process.env.POSTGRES_URL
  },
  "production": {
    "url": process.env.POSTGRES_URL
  }
}