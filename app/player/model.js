const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const HASH_ROUND = 10;

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
}, { timestamps: true });

// eslint-disable-next-line func-names
playerSchema.path('email').validate(async function (value) {
  // eslint-disable-next-line no-useless-catch
  try {
    const count = await this.model('Player').countDocuments({ email: value });
    return !count;
  } catch (err) {
    throw err;
  }
}, (attr) => `${attr.value} sudah terdaftar`);

// eslint-disable-next-line func-names
playerSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

module.exports = mongoose.model('Player', playerSchema);
