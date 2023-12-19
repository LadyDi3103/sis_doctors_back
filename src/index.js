const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'byjvth99hnme7egwpoar-mysql.services.clever-cloud.com',     // Cambia a la dirección de tu servidor MySQL
  user: 'ug2iovfdkumobqit',    // Cambia a tu nombre de usuario de MySQL
  password: 'KKQ0bqIpbrqbf3wlTILr', // Cambia a tu contraseña de MySQL
  database: 'byjvth99hnme7egwpoar' // Cambia a tu nombre de base de datos
});

// Conectar a MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MYSQK Remoto: ' + err.stack);
    return;
  }
  console.log('Conectado a MySQL con el ID ' + connection.threadId);
});

// Rutas de tu aplicación Express
app.get('/', (req, res) => {
  // Puedes realizar consultas a la base de datos aquí
  res.send('¡Hola, mundo!');
});

// Obtener todos los médicos
app.get('/medicos', (req, res) => {
    // Realizar una consulta a la base de datos
    connection.query('SELECT * FROM medicos', (error, results, fields) => {
      if (error) throw error;
      res.json(results); // Enviar los resultados como respuesta JSON
    });
  });

  // Obtener todos los pacientes
app.get('/pacientes', (req, res) => {
  connection.query('SELECT * FROM pacientes', (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});
  
// Obtener un paciente por ID
app.get('/pacientes/:id', (req, res) => {
  const pacienteId = req.params.id;
  connection.query('SELECT * FROM pacientes WHERE id = ?', [pacienteId], (error, results, fields) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Paciente no encontrado');
    }
  });
});

// Crear un nuevo paciente
app.post('/pacientes', (req, res) => {
  const nuevoPaciente = req.body; // Asumiendo que los datos del paciente se envían en el cuerpo de la solicitud
  connection.query('INSERT INTO MAE_pacientes SET ?', nuevoPaciente, (error, results, fields) => {
    if (error) throw error;
    res.json({ id: results.insertId, ...nuevoPaciente });
  });
});

// Actualizar un paciente por ID
app.put('/pacientes/:id', (req, res) => {
  const pacienteId = req.params.id;
  const datosActualizados = req.body; // Asumiendo que los datos actualizados se envían en el cuerpo de la solicitud
  connection.query('UPDATE pacientes SET ? WHERE id = ?', [datosActualizados, pacienteId], (error, results, fields) => {
    if (error) throw error;
    res.json({ id: pacienteId, ...datosActualizados });
  });
});

// Eliminar un paciente por ID
app.delete('/pacientes/:id', (req, res) => {
  const pacienteId = req.params.id;
  connection.query('DELETE FROM pacientes WHERE id = ?', [pacienteId], (error, results, fields) => {
    if (error) throw error;
    res.send('Paciente eliminado correctamente');
  });
});




app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
