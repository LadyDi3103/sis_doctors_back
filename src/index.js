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

// Obtener todos los médicos
app.get('/medicos', (req, res) => {
  try {
    // connection = createConnection()
    // Realizar una consulta a la base de datos
    pool.query('SELECT * FROM medicos', (error, results, fields) => {
      if (error) throw error;
      res.json(results); // Enviar los resultados como respuesta JSON
    });
  } catch (error) {

  } finally {
    // closeConnection(connection)
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




// ELIMINAR paciente por número de DOCUMENTO
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
  pool.query('SELECT * FROM pacientes WHERE id = ?', [pacienteId], (error, results, fields) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Paciente no encontrado');
    }
  });
});

app.post('/pacientes', (req, res) => {
  try {
    //  connection =createConnection()
    const nuevoPaciente = req.body;
    const sqlQuery = `
      INSERT INTO MAE_Paciente 
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

// editar un paciente por ID ACTUALIZAR
app.put('/pacientes/:id', async (req, res) => {
  try {
    const pacienteId = req.params.id;
    const datosActualizados = req.body;

    const sqlQuery = `UPDATE MAE_Paciente SET paciente=?, appointment=?, genderType=?, symptoms=?, signs=?, psique=?, TpAnt=?, Fcos=?, OS=?, diag=?, NumeroDocumento=?, Domicilio=?, Distrito=?, Provincia=?, Departamento=?, Num_Telf=?, Num_Cel=?, FNac=?, Hijos=?, Ocupac=?, Gpo=?, EC=?, Consulta=?, alergias=?, MEN=?, SÑO=?, Cirugias=?, CPO=?, NOC=?, AntFam=?, ANS=?, CIG=?, AntPer=?, EST=?, PesoKG=?, BMI=?, PT=?, KG=?, DES=?, MM=?, ALM=?, LON=?, Tratamientos=?, Email=? WHERE IdPaciente=?`;
    const datos = Object.values(datosActualizados);
    const valuesArray = [...datos, pacienteId];

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

// Eliminar un paciente por ID
// app.delete('/eliminarPaciente', (req, res) => {
//   console.log(req.params);
//   const tipDocumPaciente = req.params.IdTipoDocumento;
//   const codDocumPaciente = req.params.paciente.Documento;
//   pool.query('DELETE FROM MAE_Paciente WHERE IdTipoDocumento = ? AND NumeroDocumento = ? ', [tipDocumPaciente, codDocumPaciente], (error, results, fields) => {
//     if (error) throw error;
//     return res.send({message:'Paciente eliminado correctamente',results});
//   });
// });




app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});