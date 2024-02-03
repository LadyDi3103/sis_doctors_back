// const { pool } = require('../database/db');

function deleteMedico(req, res) {
  const tipDocumDoctor = req.body.tipDocum;
  const codDocumDoctor = req.body.codDocum;
  pool.query(
    'DELETE FROM medicos WHERE tip_docum = ? AND cod_docum = ? ',
    [tipDocumDoctor, codDocumDoctor],
    (error, results, fields) => {
      if (error) throw error;
      return res.send({ message: 'Doctor eliminado correctamente', results });
    }
  );
}
function editMedico(req, res) {
  try {
    const doctorId = req.params.id;

    const datosActualizados = req.body;

    const sqlQuery = `UPDATE medicos SET id_medico=?, nom_medico=?, ape_medico=?, tip_docum=?, cod_docum=?, celular=?, email=?, direccion=? WHERE id_medico=?`;

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
}
function getMedicos(req, res) {
  try {
    pool.query('SELECT * FROM medicos ', (error, results, fields) => {
      // console.log(results);
      // console.log(fields);
      if (error) throw error;
      res.json(results); // Enviar los resultados como respuesta JSON
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los medicos');
  } finally {
  }
}
function createMedico(req, res) {
  try {
    const nuevoDoctor = req.body;
    const sqlQuery = `INSERT INTO medicos SET id_medico=?, nom_medico=?, ape_medico=?, tip_docum=?, cod_docum=?, celular=?, email=?, direccion=?`;

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
}
module.exports = { deleteMedico, editMedico, getMedicos, createMedico };
