const pool = require('../database/db');
async function checkAdmin(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  console.log('Token:', token);
  console.log(token, 'TOKEN');
  try {
    const decode = verifyToken(token);
    const res = await pool.query(
      'select * from users where id =?',
      decode.id
    )[0];
    if (decode.role === 'admin' && res) {
      next();
      return;
    }
    res.status(401).json({
      message: 'You are not authorized to access this resource',
    });
    // req.user = decode
  } catch (err) {
    res.send({ message: 'Token invalid' }).status(401);
    console.error(err);
  }
}
