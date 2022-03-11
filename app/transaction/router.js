const express = require('express');
const {
  index, actionStatus,
} = require('./controller');

const router = express.Router();

const { isLoginAdmin } = require('../middleware/auth');

router.use(isLoginAdmin);
/* GET home page. */
router.get('/', index);
router.put('/status/:id', actionStatus);

module.exports = router;
