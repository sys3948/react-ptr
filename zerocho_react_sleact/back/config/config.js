require('dotenv').config();

// mysql db user로 host 및 username만 변경해주면 된다.
module.exports = {
  "development": {
    "username": "cloudAdmin0103",
    "password": process.env.MYSQL_PASSWORD,
    "database": "sleact",
    "host": "192.168.56.105",
    "dialect": "mysql"
  },
  "test": {
    "username": "cloudAdmin0103",
    "password": process.env.MYSQL_PASSWORD,
    "database": "sleact",
    "host": "192.168.56.105",
    "dialect": "mysql"
  },
  "production": {
    "username": "cloudAdmin0103",
    "password": process.env.MYSQL_PASSWORD,
    "database": "sleact",
    "host": "192.168.56.105",
    "dialect": "mysql"
  }
}
