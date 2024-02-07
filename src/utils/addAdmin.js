// Importar el paquete mysql2
const bcrypt = require('bcryptjs');
const pool = require('../database/db');
async function main() {
  try {
    // Datos del nuevo administrador
    const salt = await bcrypt.genSalt(10);
    const password = '12345';
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const nuevoAdmin = {
      email: 'zair@example.com',
      contraseña: hashedPassword,
      // Otros datos del administrador...
    };

    // Encriptar la contraseña (si es necesario)
    // Por ejemplo, puedes usar bcrypt para esto

    // Insertar el administrador en la base de datos
    // Suponiendo que el role_id predeterminado para usuarios sea 1 (administrador)
    const roleId = 1;

    // Insertar un nuevo usuario en la tabla `users`, incluyendo el role_id
    const [userInsertResult] = await pool.execute(
      'INSERT INTO users (name,email, password, role_id) VALUES (?, ?, ?,?)',
      ['roberto', nuevoAdmin.email, nuevoAdmin.contraseña, roleId]
    );

    // Obtener el `id` del usuario recién insertado
    const userId = userInsertResult.insertId;
    await pool.execute('INSERT INTO admins (user_id,num_docum) VALUES (?,?)', [
      userId,
      '33372387',
    ]);
    console.log('Administrador agregado correctamente.');
  } catch (error) {
    console.error('Error al agregar el administrador:', error);
  } finally {
    // Cerrar la conexión a la base de datos
  }
}

main();
