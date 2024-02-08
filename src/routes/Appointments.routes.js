const express = require('express');
const {
  getCita,
  createCita,
  getCitas,
} = require('../controllers/AppointmentsController');
const router = express.Router();

router.get('/getCita/:id_paciente', getCita);

router.post('/citas', createCita);
router.get('/getCitas', getCitas);

module.exports = router;
