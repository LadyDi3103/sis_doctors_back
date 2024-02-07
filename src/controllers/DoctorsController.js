const { pool } = require('../database/db');
const bcrypt = require('bcryptjs');
const hashPassword = require('../utils/hashPassword');
async function isMedicoActive(userId) {
  try {
    const [userResults] = await pool.query(
      'SELECT active FROM medicos WHERE id = ?',
      [userId]
    );
    return userResults.length > 0 && userResults[0].active === 1;
  } catch (error) {
    console.error('Error al verificar si el usuario está activo:', error);
    return false;
  }
}
//!IMPORTANT CREAR GETMEDICOS
async function getMedicos(req, res) {
  try {
    const [activeMedicos] = await pool.query(
      'SELECT * FROM medicos WHERE active = 1'
    );
    const [inactiveMedicos] = await pool.query(
      'SELECT * FROM medicos WHERE active = 0'
    );

    res.status(200).json({ status: 'success', activeMedicos, inactiveMedicos });
  } catch (error) {
    console.error('Error al obtener los médicos:', error);
    res.status(500).json({
      status: 'error',
      error: 'Error interno del servidor al obtener los médicos.',
    });
  }
}

async function deleteMedico(req, res) {
  const id = req.params.id;

  try {
    // Consultar si existe un médico con el ID proporcionado
    const [medicoResults] = await pool.query(
      'SELECT * FROM medicos WHERE id = ?',
      [id]
    );

    if (medicoResults.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Médico no encontrado.' });
    }

    // Obtener el ID del usuario asociado al médico
    const userId = medicoResults[0].user_id;

    // Verificar si el usuario está activo
    const userIsActive = await isMedicoActive(userId);

    if (!userIsActive) {
      return res.status(401).json({
        status: 'error',
        message: 'El usuario asociado al médico no está activo.',
      });
    }

    // Cambiar el estado del médico a inactivo (active = 0)
    await pool.query('UPDATE users SET active = 0 WHERE id = ?', [id]);

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
}

async function editMedico(req, res) {
  const doctorId = req.params.id;
  const datosActualizados = req.body;

  try {
    // Consultar si el médico existe y está activo
    const [medicoResults] = await pool.query(
      'SELECT * FROM medicos WHERE id = ? AND active = 1',
      [doctorId]
    );

    if (medicoResults.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Médico no encontrado o no activo.',
      });
    }

    // Obtener el ID de usuario asociado al médico
    const userId = medicoResults[0].user_id;

    // Verificar si el usuario está activo
    const userIsActive = await isMedicoActive(userId);

    if (!userIsActive) {
      return res.status(401).json({
        status: 'error',
        message: 'El usuario asociado al médico no está activo.',
      });
    }

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
}

async function getMedico(req, res) {
  const id = req.params.id;

  try {
    const [medicoResults] = await pool.query(
      'SELECT * FROM medicos WHERE id = ?',
      [id]
    );

    if (medicoResults.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Médico no encontrado.' });
    }

    // Obtener el ID del usuario asociado al médico
    const userId = medicoResults[0].user_id;

    // Verificar si el usuario está activo
    const userIsActive = await isMedicoActive(userId);

    if (!userIsActive) {
      return res.status(401).json({
        status: 'error',
        message: 'El usuario asociado al médico no está activo.',
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
}

module.exports = {
  deleteMedico,
  editMedico,
  getMedico,
  getMedicos,
  createMedico,
};
