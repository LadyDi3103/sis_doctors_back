const pool = require('../database/db');

async function getPacientes(req, res) {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM pacientes');
    res.json(rows); // Enviar los resultados como respuesta JSON
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
}

async function deletePaciente(req, res) {
  try {
    const id = req.params.id;
    const result = await pool.query('DELETE FROM pacientes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró ningún paciente con el ID proporcionado' });
    }

    return res.status(200).json({ message: 'Paciente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el paciente:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
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
async function createPaciente(req, res) {
  try {
    //  connection =createConnection()
    const nuevoPaciente = req.body;
    console.log(nuevoPaciente, 'NUEVO ');
    const sqlQuery = `
  INSERT INTO pacientes 
    (nom_paciente, ape_paciente, edad, genderType, IdTipoDocumento, num_Documento, num_Cel, email, FNac, Hijos, Domicilio, Ocupac, Gpo, EC, alergias, MEN, SÑO, Cirugias, CPO, NOC, AntFam, ANS, CIG, AntPer) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
    const values = Object.values(nuevoPaciente);

    const [result] = await pool.query(sqlQuery, values)
    console.log(result, 'RESULT 56')
    res.json({
      
      ...nuevoPaciente,
    });
    
  } catch (error) {
    console.error('Error en el manejo de la solicitud:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  } finally {

  }
}
async function editPaciente(req, res) {
  try {
    const pacienteId = req.params.id;
    const datosActualizados = req.body;

    const sqlQuery = 'UPDATE pacientes SET ? WHERE id=?';

    const [results] = await pool.query(
      sqlQuery,
      [datosActualizados, pacienteId],
      
    );
    console.log(results, 'RESULTS')
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
  } catch (error) {
    console.error('Error al actualizar el paciente:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al actualizar el paciente.',
    });
  }
}

module.exports = {
  getPacientes,
  deletePaciente,
  getPaciente,
  createPaciente,
  editPaciente,
};
