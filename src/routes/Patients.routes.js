const express = require('express');
const { pool } = require('../database/db');
const {
  getPacientes,
  deletePaciente,
  getPaciente,
  createPaciente,
  editPaciente,
} = require('../controllers/PatientsController');
const router = express.Router();
// Obtener todos los pacientes
router.get('/getPacientes', getPacientes);

// E L I M I N A R  paciente por número de id
router.delete('/deletePaciente/:id', deletePaciente);

router.get('/getPaciente/:id', getPaciente);

// C R E A  P A C I E N T E

router.post('/createPaciente', createPaciente);

// E D I T  P A C I E N T E S
router.patch('/editPaciente/:id', editPaciente);

module.exports = router;
