const express = require('express');
const mysql = require('mysql');
const cors = require('cors')
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const dbConfig = {
  connectionLimit: 10,
  host: 'byjvth99hnme7egwpoar-mysql.services.clever-cloud.com', // Cambia a la dirección de tu servidor MySQL
  user: 'ug2iovfdkumobqit', // Cambia a tu nombre de usuario de MySQL
  password: 'KKQ0bqIpbrqbf3wlTILr', // Cambia a tu contraseña de MySQL
  database: 'byjvth99hnme7egwpoar' // Cambia a tu nombre de base de datos
};

const pool = mysql.createPool(dbConfig)

// Rutas de tu aplicación Express
app.get('/', (req, res) => {
  // Puedes realizar consultas a la base de datos aquí
  res.send('¡Hola, mundo!');
});

// T O D O S  L O S  M E D I C O S
app.get('/medicos', (req, res) => {
  try {
    pool.query('SELECT * FROM Medicos', (error, results, fields) => {
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

    pool.query(sqlQuery, values, (error, results) => {
      if (error) {
        // console.error('Error al ejecutar la consulta:', error.message);
        throw error;
      }
      res.json({
        id: results.insertId,
        ...nuevoDoctor
      });
    });

  } catch (error) {
    console.error('Error en el manejo de la solicitud:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  } finally {
    console.log("------------------------------------------------------------------");
    console.log("ENTRA");
    console.log("------------------------------------------------------------------");
    // closeConnection(connection)
  }
});

// E L I M I N A R   D O C T O R   P O R   D O C U M E N T O
app.post('/eliminarMedico', (req, res) => {
  const tipDocumDoctor = req.body.tipDocum;
  const codDocumDoctor = req.body.codDocum;
  pool.query('DELETE FROM Medicos WHERE tip_docum = ? AND cod_docum = ? ', [tipDocumDoctor, codDocumDoctor], (error, results, fields) => {
    if (error) throw error;
    return res.send({message:'Doctor eliminado correctamente',results});
  });
});

// CITAS 

app.get('/citas', (req, res) => {
  try {
    pool.query('SELECT * FROM citas', (error, results, fields) => {
      if (error) throw error;
      res.json({result:results}).status(200); // Enviar los resultados como respuesta JSON
    });
  } catch (error) {
    res.json({
        message:'Ocurred error: ',
        error: error.message
    }).status(500)
    console.error('Error',error.message)
  } finally {

  }
});

app.post('/citas', (req, res) => {
  const { fecha, motivo,idMedico,idPaciente } = req.body;
  console.log(req.body);
  // Verificar si se proporcionaron fecha y motivo
  if (!fecha || !motivo || !idMedico || !idPaciente) {
    return res.status(400).json({ error: 'faltan datos obligatorios' });
  }

  // Insertar la cita en la base de datos
  const insertQuery = 'INSERT INTO citas (id_medico,id_paciente,fecha, motivo) VALUES (?,?,?,?)';
  pool.query(insertQuery, [idMedico,idPaciente,fecha, motivo], (err, result) => {
    if (err) {
      console.error('Error al insertar la cita:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    console.log('Cita creada exitosamente');
    res.status(201).json({ message: 'Cita creada exitosamente' });
  });
});

app.get('/citasPaciente/:id_paciente',(req,res)=>{
  const {id_paciente} = req.params;
  console.log(id_paciente);
  try{
    pool.query('select * from citas inner join MAE_Paciente ON citas.id_paciente = MAE_Paciente.IdPaciente where citas.id_paciente = ?', [id_paciente], function (error, results, fields) {
      if (error) throw error;
      res.json({results});
    });
  }catch (error){
    console.log(error, "EL ERROR");
  }
})
// E D I T   D A T A   D O C T O R E S
app.patch('/medicos/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;

    const datosActualizados = req.body;

    const sqlQuery = `UPDATE Medicos SET nom_medico=?, ape_medico=?, tip_docum=?, cod_docum=?, celular=?, email=?, direccion=? WHERE id_medico=?`;

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
  try{
    pool.query('SELECT * FROM MAE_Paciente', function (error, results, fields) {
      if (error) throw error;
      res.json(results); // Enviar los resultados como respuesta JSON
    });
  }catch (error){
    console.log(error, "EL ERROR");
  }
  
});


// E L I M I N A R  paciente por número de DOCUMENTO
app.post('/eliminarPaciente', (req, res) => {
  const tipDocumPaciente = req.body.tipDocum;
  const codDocumPaciente = req.body.codDocum;
  pool.query('DELETE FROM MAE_Paciente WHERE IdTipoDocumento = ? AND NumeroDocumento = ? ', [tipDocumPaciente, codDocumPaciente], (error, results, fields) => {
    if (error) throw error;
    return res.send({message:'Paciente eliminado correctamente',results});
  });
});


app.get('/pacientes/:id', (req, res) => {
  const pacienteId = req.params.id;
  pool.query('SELECT * FROM MAE_Paciente WHERE id = ?', [pacienteId], (error, results, fields) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Paciente no encontrado');
    }
  });
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
        INSERT INTO MAE_Paciente SET paciente=?, edad=?, appointment=?, genderType=?, IdTipoDocumento=?, NumeroDocumento=?,  Num_Cel=?,
        Email=?, FNac=?, Hijos=?, Domicilio=?,
        Ocupac=?, Gpo=?, EC=?, alergias=?, MEN=?, SÑO=?, Cirugias=?, CPO=?, NOC=?, AntFam=?, ANS=?, CIG=?, AntPer=? `;
  
      const values = Object.values(nuevoPaciente);
  
      pool.query(sqlQuery, values, (error, results) => {
        if (error) {
          // console.error('Error al ejecutar la consulta:', error.message);
          throw error;
        }
        res.json({
          id: results.insertId,
          ...nuevoPaciente
        });
      });
  
    } catch (error) {
      console.error('Error en el manejo de la solicitud:', error.message);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    } finally {
      console.log("------------------------------------------------------------------");
      console.log("ENTRA");
      console.log("------------------------------------------------------------------");
      // closeConnection(connection)
    }
  });
  

// E D I T  P A C I E N T E S
app.patch('/pacientes/:id', async (req, res) => {
  try {
    const pacienteId = req.params.id;

    const datosActualizados = req.body;

    const sqlQuery = `UPDATE MAE_Paciente SET IdPaciente=?, paciente=?, NumeroDocumento=?, Num_Cel=?, Domicilio=?, Email=? WHERE IdPaciente=?`;

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



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});