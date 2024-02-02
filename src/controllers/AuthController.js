const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const createToken = require('../utils/createToken');

async function Register(req, res) {
  try {
    const { name, email, password, rol } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const sqlQueryRoles = `SELECT role_id FROM roles WHERE role_name=${pool.escape(
      rol
    )}`;
    const [result] = await pool.query(sqlQueryRoles);
    const roleId = result[0].role_id;
    const sqlQueryCreateUser = `INSERT INTO users SET ?`;
    const valuesUser = {
      name,
      email,
      password: hashedPassword,
      role_id: roleId,
    };
    const [resUser] = await pool.query(sqlQueryCreateUser, valuesUser);
    const user_id = resUser.insertId;
    if (rol === 'admin') {
      const valuesAdmin = { user_id };
      await pool.query('INSERT INTO admins SET ?', valuesAdmin);
    }
    if (rol === 'medico') {
      const valuesMedico = { user_id };
      await pool.query('INSERT INTO medicos SET ?', valuesMedico);
    }
    console.log(resUser);
    res.status(200).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).json({
        message: 'Email and password are required',
      });
      return;
    }
    const [resUser] = await pool.query(`SELECT * FROM users WHERE email=?`, [
      email,
    ]);
    console.log(resUser, 'RES IUSER');
    if (resUser.length === 0) {
      res.status(401).json({
        message: 'User not found',
      });
      return;
    }
    const user = resUser[0];
    const [resRol] = await pool.query(
      `SELECT role_name FROM roles WHERE role_id=?`,
      [user.role_id]
    );
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    console.log(passwordIsCorrect, 'PASSWORD');
    if (!passwordIsCorrect) {
      res.status(401).json({
        message: 'Invalid password',
      });
      return;
    }
    const token = await createToken({
      id: user.id,
      email: user.email,
      role: resRol[0],
    });
    console.log(resRol[0], 'ROL');
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rol: resRol[0].role_name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

module.exports = {
  Register,
  Login,
};
