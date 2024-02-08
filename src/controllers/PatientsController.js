const { pool } = require('../database/db');

function getPacientes(req, res) {
  try {
    pool.query('select * from pacientes', function (error, results, fields) {
      if (error) throw error;
      res.json(results); // Enviar los resultados como respuesta JSON
    });
  } catch (error) {
    console.log(error, 'EL ERROR');
  }
  // finally {
  //   pool.end();
  // }
}

function deletePaciente(req, res) {
  const id = req.params.id;
  pool.query(
    'DELETE FROM pacientes WHERE id=?',
    [id],
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
    console.log(nuevoPaciente, 'NUEVO ');
    const sqlQuery = `
  INSERT INTO pacientes 
    (edad, appointment, genderType, IdTipoDocumento, num_Documento, num_Cel, FNac, Hijos, Domicilio, Ocupac, Gpo, EC, alergias, MEN, SÑO, Cirugias, CPO, NOC, AntFam, ANS, CIG, AntPer) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
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
      // pool.end();
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

    const sqlQuery = 'UPDATE pacientes SET ? WHERE id=?';

    pool.query(
      sqlQuery,
      [datosActualizados, pacienteId],
      (error, results, fields) => {
        if (error) {
          console.error('Error al actualizar el paciente:', error);
          return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor al actualizar el paciente.',
          });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({
            status: 'error',
            message: 'Paciente no encontrado para actualizar.',
          });
        }

        res.status(200).json({
          status: 'success',
          message: 'Paciente actualizado correctamente.',
          updatedPatient: { id: pacienteId, ...datosActualizados },
        });
      }
    );
  } catch (error) {
    console.error('Error al actualizar el paciente:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al actualizar el paciente.',
    });
  }
  // finally {
  //   pool.end();
  // }
}

module.exports = {
  getPacientes,
  deletePaciente,
  getPaciente,
  createPaciente,
  editPaciente,
};
