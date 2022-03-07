const { log } = require('debug/src/node');
const Bank = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };
      const banks = await Bank.find();
      res.render('admin/bank/view_bank', {
        banks,
        alert,
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
      log(err);
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render('admin/bank/create');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
      log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, bankName, accountNumber } = req.body;
      const nominal = await Bank({ name, bankName, accountNumber });
      await nominal.save();

      req.flash('alertMessage', 'Berhasil menambah bank');
      req.flash('alertStatus', 'success');

      res.redirect('/bank/');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
      log(err);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });

      res.render('admin/bank/edit', {
        bank,
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
      log(err);
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, bankName, accountNumber } = req.body;
      await Bank.findOneAndUpdate({ _id: id }, { name, bankName, accountNumber });

      req.flash('alertMessage', 'Berhasil mengubah bank');
      req.flash('alertStatus', 'success');

      res.redirect('/bank/');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
      log(err);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Bank.findOneAndDelete({ _id: id });

      req.flash('alertMessage', 'Berhasil menghapus bank');
      req.flash('alertStatus', 'success');

      res.redirect('/bank/');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
      log(err);
    }
  },
};
