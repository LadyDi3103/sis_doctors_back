const express = require('express');
const { pool } = require('../database/db');
const {
  deleteMedico,
  editMedico,
  getMedicos,
  createMedico,
} = require('../controllers/DoctorsController');
const router = express.Router();

router.post('/eliminarMedico', deleteMedico);

router.patch('/medicos/:id', editMedico);

router.get('/medicos', getMedicos);
// C R E A  D O C T O R  N U E V O
router.post('/medicos', createMedico);

module.exports = router;
