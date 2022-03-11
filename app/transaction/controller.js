const { log } = require('debug/src/node');
const Transacion = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };
      const transactions = await Transacion.find();
      res.render('admin/transaction/view_transaction', {
        transactions,
        alert,
        name: req.session.user.name,
        title: 'Halaman Jenis Pembayaran',
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/');
      log(err);
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;

      await Transacion.findByIdAndUpdate({ _id: id }, { status });

      req.flash('alertMessage', 'Berhasil ubah status');
      req.flash('alertStatus', 'success');
      res.redirect('/transaction');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/transaction');
      log(err);
    }
  },
};
