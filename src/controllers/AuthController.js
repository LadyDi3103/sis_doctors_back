const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// async function Register(req, res) {
//   try {
//     const { name, email, password, rol } = req.body;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hashSync(password, salt);
//     const sqlQueryRoles = `SELECT role_id FROM roles WHERE role_name=${pool.escape(
//       rol
//     )}`;
//     const [result] = await pool.query(sqlQueryRoles);
//     const roleId = result[0].role_id;
//     const sqlQueryCreateUser = `INSERT INTO users SET ?`;
//     const valuesUser = {
//       name,
//       email,
//       password: hashedPassword,
//       role_id: roleId,
//     };
//     const [resUser] = await pool.query(sqlQueryCreateUser, valuesUser);
//     const user_id = resUser.insertId;
//     if (rol === 'admin') {
//       const valuesAdmin = { user_id };
//       await pool.query('INSERT INTO admins SET ?', valuesAdmin);
//     }
//     if (rol === 'medico') {
//       const valuesMedico = { user_id };
//       await pool.query('INSERT INTO medicos SET ?', valuesMedico);
//     }
//     console.log(resUser);
//     res.status(200).json({
//       message: 'User registered successfully',
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'Internal Server Error',
//     });
//   }
// }

async function Login(req, res) {
  const { email, password } = req.body;

  try {
    // Validación de datos de entrada
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Faltan datos',
      });
    }

    // Consulta SQL para obtener la información del usuario y su estado activo
    const [rows] = await pool.execute(
      'SELECT users.*, roles.role_name FROM users INNER JOIN roles ON roles.role_id = users.role_id WHERE users.email = ?',
      [email]
    );
    // Si no se encuentra ningún usuario con el correo electrónico dado
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }

    const user = rows[0];
    if (user.role_id === 1) {
      const [adminsRows] = await pool.execute(
        'SELECT * FROM admins WHERE user_id = ?',
        [user.id]
      );
      user.active = adminsRows[0].active;
    } else if (user.role_id === 2) {
      const [medicoRows] = await pool.execute(
        'SELECT * FROM medicos WHERE user_id =?',
        [user.id]
      );
      user.active = medicoRows[0].active;
    }
    console.log(user, 'USER');
    if (!user.active) {
      return res
        .status(401)
        .json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }
    // Comparación de contraseñas
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }

    // Generación de token
    const token = generateToken(user);

    // Obtener información específica del rol
    // let role_specific_data = {};
    if (user.role_name === 'admin') {
      const [adminRows] = await pool.execute(
        'SELECT active FROM admins WHERE user_id = ?',
        [user.id]
      );
      user.active = adminRows[0].active;
    } else if (user.role_name === 'medico') {
      const [medicoRows] = await pool.execute(
        'SELECT celular, active FROM medicos WHERE user_id = ?',
        [user.id]
      );
      user.active = medicoRows[0].active;
    }

    // Excluir campos sensibles antes de enviar la respuesta
    const { id, password: _, ...userWithoutIdAndPassword } = user;

    res.json({ token, user: userWithoutIdAndPassword });
  } catch (err) {
    console.error('Error en la autenticación:', err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
}

module.exports = {
  // Register,
  Login,
};
