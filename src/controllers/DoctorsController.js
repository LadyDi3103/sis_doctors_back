const pool = require('../database/db');
const hashPassword = require('../utils/hashPassword');

// async function isMedicoActive(userId) {
//   try {
//     const [userResults] = await pool.query(
//       'SELECT active FROM medicos WHERE id = ?',
//       [userId]
//     );
//     return userResults.length > 0 && userResults[0].active === 1;
//   } catch (error) {
//     console.error('Error al verificar si el usuario está activo:', error);
//     return false;
//   }
// }

async function getMedicos(req, res) {
  try {
    const [activeMedicos] = await pool.query(
      'SELECT medicos.*, users.id, users.name, users.email, medicos.active FROM medicos INNER JOIN users ON users.id = medicos.user_id WHERE medicos.active = 1'
    );
    const [inactiveMedicos] = await pool.query(
      'SELECT medicos.*, users.id, users.name, users.email, medicos.active FROM medicos INNER JOIN users ON users.id = medicos.user_id WHERE medicos.active = 0'
    );

    res.status(200).json({ status: 'success', activeMedicos, inactiveMedicos });
  } catch (error) {
    console.error('Error al obtener los médicos:', error);
    res.status(500).json({
      status: 'error',
      error: 'Error interno del servidor al obtener los médicos.',
    });
  }
  // finally {
  //   pool.end();
  // }
}

async function deleteMedico(req, res) {
  const id = req.params.id;

  try {
    // Cambiar el estado del médico a inactivo (active = 0)
    await pool.query('UPDATE medicos SET active = 0 WHERE id = ?', [id]);

    res
      .status(200)
      .json({ status: 'success', message: 'Médico eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el médico:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al eliminar el médico.',
    });
  }
  // finally {
  //   pool.end();
  // }
}

async function editMedico(req, res) {
  const doctorId = req.params.id;
  const datosActualizados = req.body;

  try {
    // Obtener el role_id correcto si está presente en los datos actualizados
    if (datosActualizados.role) {
      const [roleRows] = await pool.query(
        'SELECT role_id FROM roles WHERE role_name = ?',
        [datosActualizados.role]
      );
      if (roleRows.length === 0) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Rol no encontrado.' });
      }
      datosActualizados.role_id = roleRows[0].role_id;
      delete datosActualizados.role; // Eliminar el campo role ya que no será actualizado en la tabla medicos
    }

    // Generar hash de la nueva contraseña si está presente
    if (datosActualizados.password) {
      datosActualizados.password = hashPassword(datosActualizados.password);
    }

    const sqlQuery = `UPDATE users 
                      INNER JOIN medicos ON users.id = medicos.user_id 
                      SET ? 
                      WHERE medicos.id = ?`;
    const valuesArray = [datosActualizados, doctorId];

    await pool.query(sqlQuery, valuesArray);

    res.status(200).json({
      status: 'success',
      message: 'Médico actualizado correctamente.',
    });
  } catch (error) {
    console.error('Error al actualizar el médico:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al actualizar el médico.',
    });
  }
  // finally {
  //   pool.end();
  // }
}

async function getMedico(req, res) {
  const id = req.params.id;

  try {
    const [medicoResults] = await pool.query(
      'SELECT * FROM medicos WHERE id = ? AND active = 1',
      [id]
    );

    if (medicoResults.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Médico no encontrado o no activo.',
      });
    }

    res.status(200).json({ status: 'success', medico: medicoResults[0] });
  } catch (error) {
    console.error('Error al obtener el médico:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al obtener el médico.',
    });
  } 
  // finally {
  //   pool.end();
  // }
}

async function createMedico(req, res) {
  try {
    const nuevoDoctor = req.body;
    const sqlQuery = `INSERT INTO medicos SET ?`;

    const { insertId } = await pool.query(sqlQuery, nuevoDoctor);

    res.json({
      id: insertId,
      ...nuevoDoctor,
    });
  } catch (error) {
    console.error('Error al crear el médico:', error);
    res
      .status(500)
      .json({ error: 'Error interno del servidor al crear el médico.' });
  }
  // finally {
  //   pool.end();
  // }
}

module.exports = {
  deleteMedico,
  editMedico,
  getMedico,
  getMedicos,
  createMedico,
};
