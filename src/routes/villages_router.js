const express = require('express');
const router = express.Router();
const villages_controller = require('../controllers/villages_controller');

router.get('/api/villages', villages_controller.get_villages);
router.post('/api/village', villages_controller.new_village);
router.put('/api/village', villages_controller.update_village);
router.delete('/api/village', villages_controller.delete_village);

module.exports = router;