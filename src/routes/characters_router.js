const express = require('express');
const router = express.Router();
const characters_controller = require('../controllers/characters_controller');

router.get('/api/characters', characters_controller.get_characters);
router.post('/api/character', characters_controller.new_character);
router.delete('/api/character', characters_controller.delete_character);

module.exports = router;