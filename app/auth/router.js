const express = require('express');
const multer = require('multer');
const os = require('os');
const { signup, signin } = require('./controller');

const router = express.Router();

/* GET home page. */
router.post('/signup', multer({ dest: os.tmpdir() }).single('image'), signup);
router.post('/signin', signin);

module.exports = router;
