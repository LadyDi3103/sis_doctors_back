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
router.get('/pacientes', getPacientes);

// E L I M I N A R  paciente por número de DOCUMENTO
router.post('/eliminarPaciente', deletePaciente);

router.get('/pacientes/:id', getPaciente);

// C R E A  P A C I E N T E

router.post('/pacientes', createPaciente);

// E D I T  P A C I E N T E S
router.patch('/pacientes/:id', editPaciente);

module.exports = router;
