const express = require('express');
const {
  getCita,
  createCita,
  getCitas,
} = require('../controllers/AppointmentsController');
const router = express.Router();

router.get('/citasPaciente/:id_paciente', getCita);

router.post('/citas', createCita);
router.get('/citas', getCitas);

module.exports = router;
