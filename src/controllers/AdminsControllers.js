const pool = require('../database/db');
const hashPassword = require('../utils/hashPassword');

async function isAdminActive(adminId) {
  try {
    const [adminResults] = await pool.query(
      'SELECT active FROM admins WHERE id = ?',
      [adminId]
    );
    return adminResults.length > 0 && adminResults[0].active === 1;
  } catch (error) {
    console.error('Error al verificar si el administrador está activo:', error);
    return false;
  }
}

async function getAdmins(req, res) {
  try {
    const [activeAdmins] = await pool.query(
      'SELECT * FROM admins WHERE active = 1'
    );
    const [inactiveAdmins] = await pool.query(
      'SELECT * FROM admins WHERE active = 0'
    );

    res.status(200).json({ status: 'success', activeAdmins, inactiveAdmins });
  } catch (error) {
    console.error('Error al obtener los administradores:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al obtener los administradores.',
    });
  }
}

async function getAdmin(req, res) {
  const adminId = req.params.id;
  try {
    const [adminResults] = await pool.query(
      'SELECT * FROM admins WHERE id = ?',
      [adminId]
    );

    if (adminResults.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Administrador no encontrado.' });
    }

    res.status(200).json({ status: 'success', admin: adminResults[0] });
  } catch (error) {
    console.error('Error al obtener el administrador:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al obtener el administrador.',
    });
  }
}
async function deleteAdmin(req, res) {
  const adminId = req.params.id;
  try {
    const [adminResults] = await pool.query(
      'SELECT user_id FROM admins WHERE id = ?',
      [adminId]
    );

    if (adminResults.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Administrador no encontrado.' });
    }

    const userId = adminResults[0].user_id;

    const isAdminActive = await isAdminActive(adminId);

    if (!isAdminActive) {
      return res
        .status(401)
        .json({ status: 'error', message: 'El administrador no está activo.' });
    }

    await pool.query('UPDATE users SET active = 0 WHERE id = ?', [userId]);

    res.status(200).json({
      status: 'success',
      message: 'Administrador desactivado correctamente.',
    });
  } catch (error) {
    console.error('Error al desactivar el administrador:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al desactivar el administrador.',
    });
  }
}

async function updateAdmin(req, res) {
  const adminId = req.params.id;
  const newData = req.body;

  try {
    const [adminResults] = await pool.query(
      'SELECT user_id FROM admins WHERE id = ?',
      [adminId]
    );

    if (adminResults.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Administrador no encontrado.',
      });
    }

    // Verificar si el administrador está activo
    const isAdminActive = await isAdminActive(adminId);

    if (!isAdminActive) {
      return res.status(401).json({
        status: 'error',
        message: 'El administrador no está activo.',
      });
    }

    // Obtener el role_id correcto si está presente en los datos actualizados
    if (newData.role) {
      const [roleRows] = await pool.query(
        'SELECT role_id FROM roles WHERE role_name = ?',
        [newData.role]
      );
      if (roleRows.length === 0) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Rol no encontrado.' });
      }
      newData.role_id = roleRows[0].role_id;
      delete newData.role; // Eliminar el campo role ya que no será actualizado en la tabla admins
    }

    // Generar hash de la nueva contraseña si está presente
    if (newData.password) {
      newData.password = hashPassword(newData.password);
    }

    const sqlQuery = `UPDATE users
                      INNER JOIN admins ON users.id = admins.user_id
                      SET ?
                      WHERE admins.id = ?`;
    const valuesArray = [newData, adminId];

    await pool.query(sqlQuery, valuesArray);

    res.status(200).json({
      status: 'success',
      message: 'Administrador actualizado correctamente.',
    });
  } catch (error) {
    console.error('Error al actualizar el administrador:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al actualizar el administrador.',
    });
  }
}

async function createAdmin(req, res) {
  const adminData = req.body;

  try {
    const [result] = await pool.query('INSERT INTO users SET ?', [adminData]);

    const userId = result.insertId;

    const adminDataWithUserId = { ...adminData, user_id: userId };

    await pool.query('INSERT INTO admins SET ?', [adminDataWithUserId]);

    res.status(201).json({
      status: 'success',
      message: 'Administrador creado correctamente.',
    });
  } catch (error) {
    console.error('Error al crear el administrador:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al crear el administrador.',
    });
  }
}

module.exports = {
  getAdmins,
  deleteAdmin,
  getAdmin,
  updateAdmin,
  createAdmin,
};
