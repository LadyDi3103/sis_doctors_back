import pool from "../database/db";
const bcrypt = require("bcryptjs");

/**
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 */
export const AuthController = () => {
  const Login = async (req, res) => {
    const { password, email } = req.body;

    try {
      // Verificar en la tabla Medicos
      const medicoResults = await queryAndCheckPassword(
        "Medicos",
        email,
        password
      );
      if (medicoResults.length > 0) {
        // El email y contraseña coinciden en la tabla Medicos
        return res.send({
          message: "Login exitoso como Medico",
          success: true,
        });
      }

      // Verificar en la tabla Admins
      const adminResults = await queryAndCheckPassword(
        "Admins",
        email,
        password
      );
      if (adminResults.length > 0) {
        // El email y contraseña coinciden en la tabla Admins
        return res.send({ message: "Login exitoso como Admin", success: true });
      }

      // Ningún usuario encontrado o contraseña incorrecta
      res.send({
        message: "El email o la contraseña son incorrectos",
        success: false,
      });
    } catch (error) {
      console.error("Error en el login:", error);
      res.send({ message: "Error en el servidor", success: false });
    }
  };

  const queryAndCheckPassword = async (table, email, password) => {
    const selectQuery = (table, email) =>
      `SELECT * FROM ${pool.escapeId(table)} WHERE email = ${pool.escape(
        email
      )}`;

    // Realizar la consulta a la base de datos
    const results = await pool.query(selectQuery(table, email));

    // Verificar la contraseña utilizando bcrypt
    if (results.length > 0) {
      const match = await bcrypt.compare(password, results[0].password || "");

      if (match) {
        return results; // La contraseña coincide
      }
    }

    return []; // Ningún usuario encontrado o la contraseña no coincide
  };

  const Register = (req, res) => {
    const saltRounds = 10;
    const { name, email, password, rol } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    const values = { name, email, password: hash, rol };

    const sql = (table) => `INSERT INTO ${pool.escapeId(table)} SET ?`;
    if ((!name || !email || !password, !rol)) {
      res.send({ message: "Data incorrect", success: false });
      return;
    }
    if (rol === "doctor") {
      pool.query(sql("Medicos"), values, (err, result) => {
        if (err) throw err;
        res.send({ message: "Data correct", success: true });
      });
    } else if (rol === "admin") {
      pool.query(sql("Admins"), values, (err, result) => {
        if (err) throw err;
        res.send({ message: "Data correct", success: true });
      });
    }
  };

  return {
    Login,
    Register,
  };
};

module.exports = {
  AuthController,
};
