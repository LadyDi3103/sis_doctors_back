const mysql = require('mysql2/promise');

const dbConfig = {
  connectionLimit: 10,
  host: 'byjvth99hnme7egwpoar-mysql.services.clever-cloud.com',
  user: 'ug2iovfdkumobqit',
  password: 'KKQ0bqIpbrqbf3wlTILr',
  database: 'byjvth99hnme7egwpoar',
  waitForConnections: true,
  queueLimit: 0,
  idleTimeout: 60000, // tiempo de espera de 1 minuto
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
