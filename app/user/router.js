const express = require('express');
const {
  viewSignIn, actionSignIn,
} = require('./controller');

const router = express.Router();

/* GET home page. */
router.get('/', viewSignIn);
router.post('/', actionSignIn);

module.exports = router;
