const pool = require('../database/db');
function isAdmin(req, res, next) {
  if (!req.user || req.user.role_id !== 1) {
    return res.status(403).json({
      error: 'Acceso denegado. Se requieren privilegios de administrador.',
    });
  }
  next();
}
module.exports = isAdmin;
