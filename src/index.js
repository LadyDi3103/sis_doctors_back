const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const RoutesAuthentication = require('./routes/Authentication.routes');
const RoutesCitas = require('./routes/Appointments.routes');
const RoutesMedicos = require('./routes/Doctors.routes');
const RoutesPacientes = require('./routes/Patients.routes');
const { authToken } = require('./middlewares/AuthToken.middleware');
app.use(cors());
app.use(express.json());

app.use('/auth', RoutesAuthentication);
app.use('/citas', authToken, RoutesCitas);
app.use('/medicos', authToken, RoutesMedicos);
app.use('/pacientes', authToken, RoutesPacientes);

// T O D O S  L O S  M E D I C O S
app.get('/medicos', (req, res) => {
  try {
    pool.query('SELECT * FROM Medicos ', (error, results, fields) => {
      // console.log(results);
      // console.log(fields);
      if (error) throw error;
      res.json(results); // Enviar los resultados como respuesta JSON
    });
  } catch (error) {
  } finally {
  }
});

// C R E A  D O C T O R  N U E V O
app.post('/medicos', (req, res) => {
  try {
    const nuevoDoctor = req.body;
    const sqlQuery = `INSERT INTO Medicos SET nom_medico=?, ape_medico=?, tip_docum=?, cod_docum=?, celular=?, email=?, direccion=?`;
    // const sqlQuery = `INSERT INTO Medicos SET id_medico=?, nom_medico=?, ape_medico=?, tip_docum=?, cod_docum=?, celular=?, email=?, direccion=?`;
    const values = Object.values(nuevoDoctor);

    pool.query(sqlQuery, values, (error, results, fields) => {
      if (error) {
        // console.error('Error al ejecutar la consulta:', error.message);
        throw error;
      }

      res.json({
        id: results.insertId,
        ...nuevoDoctor,
      });
    });
  } catch (error) {
    console.error('Error en el manejo de la solicitud:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  } finally {
    console.log(
      '------------------------------------------------------------------'
    );
    console.log('ENTRA');
    console.log(
      '------------------------------------------------------------------'
    );
    // closeConnection(connection)
  }
});

// E L I M I N A R   D O C T O R   P O R   D O C U M E N T O
app.post('/eliminarMedico', (req, res) => {
  const tipDocumDoctor = req.body.tipDocum;
  const codDocumDoctor = req.body.codDocum;
  pool.query(
    'DELETE FROM Medicos WHERE tip_docum = ? AND cod_docum = ? ',
    [tipDocumDoctor, codDocumDoctor],
    (error, results, fields) => {
      if (error) throw error;
      return res.send({ message: 'Doctor eliminado correctamente', results });
    }
  );
});

// CITAS

app.get('/citas', (req, res) => {
  try {
    pool.query('SELECT * FROM citas', (error, results, fields) => {
      if (error) throw error;
      res.json({ result: results }).status(200); // Enviar los resultados como respuesta JSON
    });
  } catch (error) {
    res
      .json({
        message: 'Ocurred error: ',
        error: error.message,
      })
      .status(500);
    console.error('Error', error.message);
  } finally {
  }
});

app.post('/citas', (req, res) => {
  const { fecha, tratamiento,id_medico,id_paciente, estado } = req.body;
  console.log(req.body);
  // Verificar si se proporcionaron fecha y tratamiento
  if (!fecha || !tratamiento || !id_medico || !id_paciente  || !estado) {
    return res.status(400).json({ error: 'faltan datos obligatorios' });
  }
  // Insertar la cita en la base de datos
  const insertQuery = 'INSERT INTO citas (id_medico, id_paciente, fecha, tratamiento, estado) VALUES (?,?,?,?,?)';
  pool.query(insertQuery, [id_medico, id_paciente, fecha, tratamiento, estado], (err, result) => {
    if (err) {
      console.error('Error al insertar la cita:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

      console.log('Cita creada exitosamente');
      res.status(201).json({ message: 'Cita creada exitosamente' });
    }
  );
});

app.get('/citasPaciente/:id_paciente', (req, res) => {
  const { id_paciente } = req.params;
  console.log(id_paciente);
  try {
    pool.query(
      'select * from citas inner join MAE_Paciente ON citas.id_paciente = MAE_Paciente.IdPaciente where citas.id_paciente = ?',
      [id_paciente],
      function (error, results, fields) {
        if (error) throw error;
        res.json({ results });
      }
    );
  } catch (error) {
    console.log(error, 'EL ERROR');
  }
});
// E D I T   D A T A   D O C T O R E S
app.patch('/medicos/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;

    const datosActualizados = req.body;

    const sqlQuery = `UPDATE Medicos SET nom_medico=?, ape_medico=?, tip_docum=?, cod_docum=?, celular=?, email=?, direccion=? WHERE id=?`;

    const valuesArray = [...Object.values(datosActualizados), doctorId];

    pool.query(sqlQuery, valuesArray, (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error al actualizar el medico');
      }

      res.json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el médico');
  }
});

// ************************************************************************************************

// Obtener todos los pacientes
app.get('/pacientes', (req, res) => {
  try {
    pool.query('SELECT * FROM paciente', function (error, results, fields) {
      if (error) throw error;
      res.json(results); // Enviar los resultados como respuesta JSON
    });
  } catch (error) {
    console.log(error, 'EL ERROR');
  }
});
// GET TOTAL PACIENTES

app.get('/totalPacientes', (req, res) => {
  try {
    pool.query('SELECT * FROM pacientes', function (error, results, fields) {
      if (error) throw error;
      res.json({ result: results.length }); // Enviar los resultados como respuesta JSON
    });
  } catch (error) {
    console.log(error, 'EL ERROR');
  }
});

// E L I M I N A R  paciente por número de DOCUMENTO
app.post('/eliminarPaciente', (req, res) => {
  const tipDocumPaciente = req.body.tipDocum;
  const codDocumPaciente = req.body.codDocum;
  pool.query(
    'DELETE FROM pacientes WHERE IdTipoDocumento = ? AND NumeroDocumento = ? ',
    [tipDocumPaciente, codDocumPaciente],
    (error, results, fields) => {
      if (error) throw error;
      return res.send({ message: 'Paciente eliminado correctamente', results });
    }
  );
});

app.get('/pacientes/:id', (req, res) => {
  const pacienteId = req.params.id;
  pool.query(
    'SELECT * FROM pacientes WHERE id = ?',
    [pacienteId],
    (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send('Paciente no encontrado');
      }
    }
  );
});

// C R E A  P A C I E N T E


// app.post('/pacientes', (req, res) => {
//   try {
//     //  connection =createConnection()
//     const nuevoPaciente = req.body;
//     const sqlQuery = `
//       INSERT INTO MAE_Paciente 
//       SET paciente=?, appointment=?, genderType=?, symptoms=?, signs=?, 
//           psique=?, TpAnt=?, Fcos=?, OS=?, diag=?, NumeroDocumento=?, 
//           Domicilio=?, Distrito=?, Provincia=?, Departamento=?, Num_Telf=?, 
//           Num_Cel=?, FNac=?, Hijos=?, Ocupac=?, Gpo=?, EC=?, Consulta=?, 
//           alergias=?, MEN=?, SÑO=?, Cirugias=?, CPO=?, NOC=?, AntFam=?, 
//           ANS=?, CIG=?, AntPer=?, EST=?, PesoKG=?, BMI=?, PT=?, KG=?, 
//           DES=?, MM=?, ALM=?, LON=?, CEN=?, FDS=?, Dlk=?, Likes=?, 
//           Tratamientos=?,  Email=? `;

//     const values = Object.values(nuevoPaciente);

//     pool.query(sqlQuery, values, (error, results) => {
//       if (error) {
//         // console.error('Error al ejecutar la consulta:', error.message);
//         throw error;
//       }
//       res.json({
//         id: results.insertId,
//         ...nuevoPaciente
//       });
//     });

//   } catch (error) {
//     console.error('Error en el manejo de la solicitud:', error.message);
//     res.status(500).json({
//       error: 'Error interno del servidor'
//     });
//   } finally {
//     console.log("------------------------------------------------------------------");
//     console.log("ENTRA");
//     console.log("------------------------------------------------------------------");
//     // closeConnection(connection)
//   }
// });

app.post('/pacientes', (req, res) => {
  try {
    //  connection =createConnection()
    const nuevoPaciente = req.body;
    const sqlQuery = `
      INSERT INTO pacientes 
      SET paciente=?, appointment=?, genderType=?, symptoms=?, signs=?, 
          psique=?, TpAnt=?, Fcos=?, OS=?, diag=?, NumeroDocumento=?, 
          Domicilio=?, Distrito=?, Provincia=?, Departamento=?, Num_Telf=?, 
          Num_Cel=?, FNac=?, Hijos=?, Ocupac=?, Gpo=?, EC=?, Consulta=?, 
          alergias=?, MEN=?, SÑO=?, Cirugias=?, CPO=?, NOC=?, AntFam=?, 
          ANS=?, CIG=?, AntPer=?, EST=?, PesoKG=?, BMI=?, PT=?, KG=?, 
          DES=?, MM=?, ALM=?, LON=?, CEN=?, FDS=?, Dlk=?, Likes=?, 
          Tratamientos=?,  Email=? `;

    const values = Object.values(nuevoPaciente);

    pool.query(sqlQuery, values, (error, results) => {
      if (error) {
        // console.error('Error al ejecutar la consulta:', error.message);
        throw error;
      }
      res.json({
        id: results.insertId,
        ...nuevoPaciente,
      });
    });
  } catch (error) {
    console.error('Error en el manejo de la solicitud:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  } finally {
    console.log(
      '------------------------------------------------------------------'
    );
    console.log('ENTRA');
    console.log(
      '------------------------------------------------------------------'
    );
    // closeConnection(connection)
  }
});

// E D I T  P A C I E N T E S
app.patch('/pacientes/:id', async (req, res) => {
  try {
    const pacienteId = req.params.id;

    const datosActualizados = req.body;

    const sqlQuery = `UPDATE pacientes SET id_medico= ?, IdPaciente=?, paciente=?, NumeroDocumento=?, Num_Cel=?, Domicilio=?, Email=? WHERE IdPaciente=?`;

    const valuesArray = [...Object.values(datosActualizados), pacienteId];

    pool.query(sqlQuery, valuesArray, (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error al actualizar el paciente');
      }

      res.json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el paciente');
  }
});

app.post('/login', authToken, async (req, res) => {
  console.log(req.body, 'body');
  const hash = bcript.hashSync(req.body.password, saltRounds);
  const igual = bcript.compareSync(req.body.password, hash);
  const igual1 = bcript.compareSync(req.body.password1, hash);
  const token = signToken({ data: { name: 'name' } });
  const decode = verifyToken(token);
  console.log(decode, 'DECODE');
  console.log(token, 'TOKEN');
  console.log(hash, 'HASH');
  console.log(igual, 'HASH');
  console.log(igual1, 'HASH');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
