const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const { log } = require('console');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
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
// app.post('/pacientes', (req, res) => {
//   const nuevoPaciente = req.body;// Asumiendo que los datos del paciente se envían en el cuerpo de la solicitud
//   console.log(req, 'REQ.BODY'),

//   connection.query('INSERT INTO MAE_pacientes SET paciente=?, appointment=?, genderType=?, symptoms=?, signs=?, psique=?, TpAnt=?, Fcos=?, OS=?, diag=?, NumeroDocumento=?, Domicilio=?, Distrito=?, Provincia=?, Departamento=?, Num_Telf=?, Num_Cel=?, FNac=?, Hijos=?, Ocupac=?, Gpo=?, EC=?, Consulta=?, alergias=?, MEN=?, SÑO=?, Cirugias=?, CPO=?, NOC=?, AntFam=?, ANS=?, CIG=?, AntPer=?, EST=?, PesoKG=?, BMI=?, PT=?, KG=?, DES=?, MM=?, ALM=?, LON=?, CEN=?, FDS=?, Dlk=?, Likes=?, Tratamientos=?', 
//   [
//     nuevoPaciente.paciente,
//     nuevoPaciente.appointment,
//     nuevoPaciente.genderType,
//     nuevoPaciente.symptoms,
//     nuevoPaciente.signs,
//     nuevoPaciente.psique,
//     nuevoPaciente.TpAnt,
//     nuevoPaciente.Fcos,
//     nuevoPaciente.OS,
//     nuevoPaciente.NumeroDocumento,
//     nuevoPaciente.Domicilio,
//     nuevoPaciente.Distrito,
//     nuevoPaciente.Provincia,
//     nuevoPaciente.Departamento,
//     nuevoPaciente.Num_Telf,
//     nuevoPaciente.Num_Cel,
//     nuevoPaciente.FNac,
//     nuevoPaciente.Hijos,
//     nuevoPaciente.Ocupac,
//     nuevoPaciente.Gpo,
//     nuevoPaciente.EC,
//     nuevoPaciente.Consulta,
//     nuevoPaciente.alergias,
//     nuevoPaciente.MEN,
//     nuevoPaciente.SÑO,
//     nuevoPaciente.Cirugias,
//     nuevoPaciente.CPO,
//     nuevoPaciente.NOC,
//     nuevoPaciente.AntFam,
//     nuevoPaciente.ANS,
//     nuevoPaciente.CIG,
//     nuevoPaciente.AntPer,
//     nuevoPaciente.EST,
//     nuevoPaciente.PesoKG,
//     nuevoPaciente.BMI,
//     nuevoPaciente.PT,
//     nuevoPaciente.KG,
//     nuevoPaciente.DES,
//     nuevoPaciente.MM,
//     nuevoPaciente.ALM,
//     nuevoPaciente.LON,
//     nuevoPaciente.CEN,
//     nuevoPaciente.FDS,
//     nuevoPaciente.Dlk,
//     nuevoPaciente.Likes,
//     nuevoPaciente.Tratamientos,
//   ], (error, results, fields) => {
//     if (error) throw error;
//     res.json({ id: results.insertId, ...nuevoPaciente });
//   });
// });

// Crear un nuevo paciente
// app.post('/pacientes', (req, res) => {
//   const nuevoPaciente = req.body; // Asumiendo que los datos del paciente se envían en el cuerpo de la solicitud
//   console.log(req, 'REQ.BODY');

//   const sqlQuery = `
//     INSERT INTO MAE_Paciente 
//     SET paciente=?, appointment=?, genderType=?, symptoms=?, signs=?, 
//         psique=?, TpAnt=?, Fcos=?, OS=?, diag=?, NumeroDocumento=?, 
//         Domicilio=?, Distrito=?, Provincia=?, Departamento=?, Num_Telf=?, 
//         Num_Cel=?, FNac=?, Hijos=?, Ocupac=?, Gpo=?, EC=?, Consulta=?, 
//         alergias=?, MEN=?, SÑO=?, Cirugias=?, CPO=?, NOC=?, AntFam=?, 
//         ANS=?, CIG=?, AntPer=?, EST=?, PesoKG=?, BMI=?, PT=?, KG=?, 
//         DES=?, MM=?, ALM=?, LON=?, CEN=?, FDS=?, Dlk=?, Likes=?, 
//         Tratamientos=?`;

//   const values = [
//     nuevoPaciente.paciente,
//     nuevoPaciente.appointment,
//     nuevoPaciente.genderType,
//     nuevoPaciente.symptoms,
//     nuevoPaciente.signs,
//     nuevoPaciente.psique,
//     nuevoPaciente.TpAnt,
//     nuevoPaciente.Fcos,
//     nuevoPaciente.OS,
//     nuevoPaciente.diag,
//     nuevoPaciente.NumeroDocumento,
//     nuevoPaciente.Domicilio,
//     nuevoPaciente.Distrito,
//     nuevoPaciente.Provincia,
//     nuevoPaciente.Departamento,
//     nuevoPaciente.Num_Telf,
//     nuevoPaciente.Num_Cel,
//     nuevoPaciente.FNac,
//     nuevoPaciente.Hijos,
//     nuevoPaciente.Ocupac,
//     nuevoPaciente.Gpo,
//     nuevoPaciente.EC,
//     nuevoPaciente.Consulta,
//     nuevoPaciente.alergias,
//     nuevoPaciente.MEN,
//     nuevoPaciente.SÑO,
//     nuevoPaciente.Cirugias,
//     nuevoPaciente.CPO,
//     nuevoPaciente.NOC,
//     nuevoPaciente.AntFam,
//     nuevoPaciente.ANS,
//     nuevoPaciente.CIG,
//     nuevoPaciente.AntPer,
//     nuevoPaciente.EST,
//     nuevoPaciente.PesoKG,
//     nuevoPaciente.BMI,
//     nuevoPaciente.PT,
//     nuevoPaciente.KG,
//     nuevoPaciente.DES,
//     nuevoPaciente.MM,
//     nuevoPaciente.ALM,
//     nuevoPaciente.LON,
//     nuevoPaciente.CEN,
//     nuevoPaciente.FDS,
//     nuevoPaciente.Dlk,
//     nuevoPaciente.Likes,
//     nuevoPaciente.Tratamientos,
//   ];

//   connection.query(sqlQuery, values, (error, results, fields) => {
//     if (error) throw error;
//     res.json({ id: results.insertId, ...nuevoPaciente });

//   });
//   connection.end((err) => {
//     if (err) {
//       console.error('Error al cerrar la conexión:', err.message);
//     } else {
//       console.log('Conexión cerrada.');
//     }
//   });
// });
app.post('/pacientes', (req, res) => {
  try {
    const nuevoPaciente = req.body;
    console.log(req.body, 'REQ.BODY');

    const sqlQuery = `
      INSERT INTO MAE_Paciente 
      SET paciente=?, appointment=?, genderType=?, symptoms=?, signs=?, 
          psique=?, TpAnt=?, Fcos=?, OS=?, diag=?, NumeroDocumento=?, 
          Domicilio=?, Distrito=?, Provincia=?, Departamento=?, Num_Telf=?, 
          Num_Cel=?, FNac=?, Hijos=?, Ocupac=?, Gpo=?, EC=?, Consulta=?, 
          alergias=?, MEN=?, SÑO=?, Cirugias=?, CPO=?, NOC=?, AntFam=?, 
          ANS=?, CIG=?, AntPer=?, EST=?, PesoKG=?, BMI=?, PT=?, KG=?, 
          DES=?, MM=?, ALM=?, LON=?, CEN=?, FDS=?, Dlk=?, Likes=?, 
          Tratamientos=?`;

    const values = Object.values(nuevoPaciente);

    connection.query(sqlQuery, values, (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error.message);
        throw error;
      }

      res.json({ id: results.insertId, ...nuevoPaciente });
    });
  } catch (error) {
    console.error('Error en el manejo de la solicitud:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    connection.end((err) => {
      if (err) {
        console.error('Error al cerrar la conexión:', err.message);
      } else {
        console.log('Conexión cerrada.');
      }
    });
  }
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
