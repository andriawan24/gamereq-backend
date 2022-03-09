const mongoose = require('mongoose');
const { urlDb, userDb, passDb } = require('../config');

mongoose.connect(urlDb, {
  useUnifiedTopology: true,
  user: userDb,
  pass: passDb,
  useNewUrlParser: true,
});

const db = mongoose.connection;

module.exports = db;
