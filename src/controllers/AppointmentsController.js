const { pool } = require('../database/db');

function getCita(req, res) {
  const { id_paciente } = req.params;
  console.log(id_paciente);
  try {
    pool.query(
      'select * from citas inner join pacientes ON citas.id_paciente = pacientes.id where citas.paciente_id = ?',
      [id_paciente],
      function (error, results, fields) {
        if (error) throw error;
        res.json({ results });
      }
    );
  } catch (error) {
    console.log(error, 'EL ERROR');
  }
}
function createCita(req, res) {
  const { fecha, motivo, idMedico, idPaciente } = req.body;
  console.log(req.body);
  // Verificar si se proporcionaron fecha y motivo
  if (!fecha || !motivo || !idMedico || !idPaciente) {
    return res.status(400).json({ error: 'faltan datos obligatorios' });
  }
  // Insertar la cita en la base de datos
  const insertQuery =
    'INSERT INTO citas (id_medico,id_paciente,fecha, motivo) VALUES (?,?,?,?)';
  pool.query(
    insertQuery,
    [idMedico, idPaciente, fecha, motivo],
    (err, result) => {
      if (err) {
        console.error('Error al insertar la cita:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      console.log('Cita creada exitosamente');
      res.status(201).json({ message: 'Cita creada exitosamente' });
    }
  );
}
function getCitas(req, res) {
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
}
module.exports = {
  getCita,
  createCita,
  getCitas,
};
