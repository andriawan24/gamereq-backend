const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  historyVoucherTopup: {
    gameName: { type: String, require: [true, 'Nama game harus diisi'] },
    category: { type: String, require: [true, 'Kategori harus diisi'] },
    thumbnail: { type: String },
    coinName: { type: String, require: [true, 'Nama koin harus diisi'] },
    coinQuantity: { type: String, require: [true, 'Jumlah koin harus diisi'] },
    price: { type: Number },
  },
  historyPayment: {
    name: { type: String, require: [true, 'Nama harus diisi'] },
    type: { type: String, require: [true, 'Tipe pembayaran harus diisi'] },
    bankName: { type: String, require: [true, 'Nama bank harus diisi'] },
    accountNumber: { type: String, require: [true, 'Nomor rekening harus diisi'] },
  },
  name: {
    type: String,
    required: [true, 'Nama harus diisi'],
    maxlength: [225, 'Panjang nama harus antara 3 - 225 karakter'],
    minlength: [3, 'Panjang nama harus antara 3 - 225 karakter'],
  },
  accountUser: {
    type: String,
    required: [true, 'Nama akun harus diisi'],
    maxlength: [225, 'Panjang nama harus antara 3 - 225 karakter'],
    minlength: [3, 'Panjang nama harus antara 3 - 225 karakter'],
  },
  tax: {
    type: Number,
    default: 0,
  },
  value: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  voucherTopup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher',
  },
  historyUser: {
    name: {
      type: String,
      required: [true, 'Nama player harus diisi'],
    },
    phoneNumber: {
      type: String,
      maxlength: [13, 'Panjang nama harus antara 9 - 13 karakter'],
      minlength: [9, 'Panjang nama harus antara 9 - 13 karakter'],
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timeStamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
