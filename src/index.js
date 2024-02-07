const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const pool = require('./database/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

// Importar rutas
const RoutesAuth = require('./routes/Authentication.routes');
const RoutesCitas = require('./routes/Appointments.routes');
const RoutesMedicos = require('./routes/Doctors.routes');
const RoutesPacientes = require('./routes/Patients.routes');
const AdminsPacientes = require('./routes/Admins.router');
const isAdmin = require('./middlewares/isAdmin.middleware');
const generateToken = require('./utils/generateToken');

app.use(cors());
app.use(express.json());

// Configuración de Passport con la estrategia JWT
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
    },
    async function (jwtPayload, done) {
      try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [
          jwtPayload.id,
        ]);
        if (rows.length === 0) {
          return done(null, false);
        }
        const user = rows[0];
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Middleware de Passport para verificar la autenticación con JWT
const requireAuth = passport.authenticate('jwt', { session: false });

app.use('/auth', RoutesAuth);

// Ejemplo de rutas protegidas que requieren autenticación y privilegios de administrador
app.get('/admin/data', requireAuth, isAdmin, (req, res) => {
  res.json({
    message: 'Datos protegidos para administradores obtenidos correctamente.',
    user: req.user,
  });
});
app.get('/data', requireAuth, (req, res) => {
  res.json({
    message: 'Datos protegidos para administradores obtenidos correctamente.',
    user: req.user,
  });
});

// Ejemplo de rutas protegidas que requieren autenticación
app.use('/citas', requireAuth, RoutesCitas);
app.use('/medicos', requireAuth, RoutesMedicos);
app.use('/pacientes', requireAuth, RoutesPacientes);
app.use('/admins', requireAuth, isAdmin, AdminsPacientes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
