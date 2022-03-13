const express = require('express');
const {
  landingPage, detailPage, category, checkout,
} = require('./controller');
const { isLoginPlayer } = require('../middleware/auth');

const router = express.Router();

/* GET home page. */
router.get('/landingpage', landingPage);
router.get('/:id/detail', detailPage);
router.get('/category', category);
router.post('/checkout', isLoginPlayer, checkout);

module.exports = router;
