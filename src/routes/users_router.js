const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/users_controller');

router.get('/api/users', users_controller.get_users);
router.post('/api/user', users_controller.new_user);
router.delete('/api/user', users_controller.delete_user);
router.put('/api/user', users_controller.update_user);

module.exports = router;