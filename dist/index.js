"use strict";

var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var app = express();
var PORT = 3000;
app.use(cors());
// Configuración de la conexión a MySQL
var connection = mysql.createConnection({
  host: 'byjvth99hnme7egwpoar-mysql.services.clever-cloud.com',
  // Cambia a la dirección de tu servidor MySQL
  user: 'ug2iovfdkumobqit',
  // Cambia a tu nombre de usuario de MySQL
  password: 'KKQ0bqIpbrqbf3wlTILr',
  // Cambia a tu contraseña de MySQL
  database: 'byjvth99hnme7egwpoar' // Cambia a tu nombre de base de datos
});

// Conectar a MySQL
connection.connect(function (err) {
  if (err) {
    console.error('Error al conectar a MYSQK Remoto: ' + err.stack);
    return;
  }
  console.log('Conectado a MySQL con el ID ' + connection.threadId);
});

// Rutas de tu aplicación Express
app.get('/', function (req, res) {
  // Puedes realizar consultas a la base de datos aquí
  res.send('¡Hola, mundo!');
});
app.get('/medicos', function (req, res) {
  // Realizar una consulta a la base de datos
  connection.query('SELECT * FROM medicos', function (error, results, fields) {
    if (error) throw error;
    res.json(results); // Enviar los resultados como respuesta JSON
  });
});
app.listen(PORT, function () {
  console.log("Servidor corriendo en http://localhost:".concat(PORT));
});