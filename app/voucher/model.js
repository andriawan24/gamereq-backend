const mongoose = require('mongoose');

const voucherSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Nama game harus diisi'],
  },
  status: {
    type: String,
    enum: ['Y', 'N'],
    default: 'Y',
  },
  thumbnail: {
    type: String,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  nominals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nominal',
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Voucher', voucherSchema);
