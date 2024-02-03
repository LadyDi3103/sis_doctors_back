const { pool } = require('../database/db');

function getPacientes(req, res) {
  try {
    pool.query('SELECT * FROM pacientes', function (error, results, fields) {
      if (error) throw error;
      res.json(results); // Enviar los resultados como respuesta JSON
    });
  } catch (error) {
    console.log(error, 'EL ERROR');
  }
}

function deletePaciente(req, res) {
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
}
function getPaciente(req, res) {
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
}
function createPaciente(req, res) {
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
}
function editPaciente(req, res) {
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
}
module.exports = {
  getPacientes,
  deletePaciente,
  getPaciente,
  createPaciente,
  editPaciente,
};
