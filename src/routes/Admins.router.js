const express = require('express');
const router = express.Router();
const AdminsController = require('../controllers/AdminsControllers');

router.get('/getAdmins', AdminsController.getAdmins);
router.delete('/deletAdmin/:id', AdminsController.deleteAdmin);
router.get('/getAdmin/:id', AdminsController.getAdmin);
router.put('/updateAdmin/:id', AdminsController.updateAdmin);
router.put('/updateAdmin/:id', AdminsController.updateAdmin);

module.exports = router;
