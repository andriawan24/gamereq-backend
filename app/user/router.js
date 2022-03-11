const express = require('express');
const {
  viewSignIn, actionSignIn, actionLogout,
} = require('./controller');

const router = express.Router();

/* GET home page. */
router.get('/', viewSignIn);
router.post('/', actionSignIn);
router.get('/logout', actionLogout);

module.exports = router;
