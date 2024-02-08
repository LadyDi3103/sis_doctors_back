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
    if (!email || !password) {
      return res.json({
        status: 'error',
        message: 'Faltan datos',
      });
    }
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    if (
      rows.length === 0 ||
      !(await bcrypt.compare(password, rows[0].password)) ||
      rows[0].active === 0
    ) {
      return res
        .status(401)
        .json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }
    const token = generateToken(rows[0]);
    const { id, password: _, ...userWithoutIdAndPassword } = rows[0];
    res.json({ token, user: userWithoutIdAndPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
}

module.exports = {
  // Register,
  Login,
};
