const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({
    title: "Naruto API - Get the names of the characters from Naruto!",
    version: '1.0'
  })
});
module.exports = router;