const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/users_controller');
const auth = require('../middlewares/auth');

router.get('/api/users', auth, users_controller.get_users);
router.post('/api/user', users_controller.new_user);
router.post('/api/user/login', users_controller.login);
router.put('/api/user', users_controller.update_user);
router.delete('/api/user', users_controller.delete_user);

module.exports = router;