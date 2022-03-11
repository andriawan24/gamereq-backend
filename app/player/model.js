const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, 'Email harus diisi'],
  },
  name: {
    type: String,
    require: [true, 'Name harus diisi'],
  },
  username: {
    type: String,
    require: [true, 'Name harus diisi'],
  },
  password: {
    type: String,
    require: [true, 'Password harus diisi'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin',
  },
  status: {
    type: String,
    enum: ['Y', 'N'],
    default: 'Y',
  },
  avatar: {
    type: String,
  },
  fileName: {
    type: String,
  },
  phoneNumber: {
    type: String,
    require: [true, 'No. Telepon harus diisi'],
  },
  favoriteItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
}, { timeStamps: true });

module.exports = mongoose.model('Player', playerSchema);
