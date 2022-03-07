const { log } = require('debug/src/node');
const Payment = require('./model');
const Bank = require('../bank/model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };
      const payments = await Payment.find()
        .populate('banks');
      res.render('admin/payment/view_payment', {
        payments,
        alert,
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
      log(err);
    }
  },
  viewCreate: async (req, res) => {
    try {
      const banks = await Bank.find();
      res.render('admin/payment/create', {
        banks,
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
      log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { banks, type } = req.body;
      const payment = await Payment({ banks, type });
      await payment.save();

      req.flash('alertMessage', 'Berhasil menambah jenis pembayaran');
      req.flash('alertStatus', 'success');

      res.redirect('/payment/');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
      log(err);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findOne({ _id: id });
      const banks = await Bank.find();

      res.render('admin/payment/edit', {
        payment,
        banks,
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
      log(err);
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { banks, type } = req.body;
      await Payment.findOneAndUpdate({ _id: id }, { banks, type });

      req.flash('alertMessage', 'Berhasil mengubah jenis pembayaran');
      req.flash('alertStatus', 'success');

      res.redirect('/payment/');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
      log(err);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Payment.findOneAndDelete({ _id: id });

      req.flash('alertMessage', 'Berhasil menghapus jenis pembayaran');
      req.flash('alertStatus', 'success');

      res.redirect('/payment/');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
      log(err);
    }
  },
};
