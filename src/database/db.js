const mysql = require('mysql2/promise');

const dbConfig = {
  connectionLimit: 10,
  host: 'byjvth99hnme7egwpoar-mysql.services.clever-cloud.com',
  user: 'ug2iovfdkumobqit',
  password: 'KKQ0bqIpbrqbf3wlTILr',
  database: 'byjvth99hnme7egwpoar',
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
