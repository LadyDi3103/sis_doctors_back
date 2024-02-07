const express = require('express');
const { pool } = require('../database/db');
const {
  deleteMedico,
  editMedico,
  getMedicos,
  createMedico,
} = require('../controllers/DoctorsController');
const router = express.Router();

router.delete('/deleteMedico/:id', deleteMedico);

router.patch('/editMedico/:id', editMedico);

router.get('/getMedicos', getMedicos);
// C R E A  D O C T O R  N U E V O
router.post('/createMedico', createMedico);

module.exports = router;
