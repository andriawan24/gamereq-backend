const { log } = require('debug/src/node');
const Payment = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };
      const payments = await Payment.find();
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
      res.render('admin/payment/create');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
      log(err);
    }
  },
  //   actionCreate: async (req, res) => {
  //     try {
  //       const { coinName, coinQuantity, price } = req.body;
  //       const nominal = await Nominal({ coinName, coinQuantity, price });
  //       await nominal.save();

  //       req.flash('alertMessage', 'Berhasil menambah nominal');
  //       req.flash('alertStatus', 'success');

  //       res.redirect('/nominal/');
  //     } catch (err) {
  //       req.flash('alertMessage', `${err.message}`);
  //       req.flash('alertStatus', 'danger');
  //       res.redirect('/nominal');
  //       log(err);
  //     }
  //   },
  //   viewEdit: async (req, res) => {
  //     try {
  //       const { id } = req.params;
  //       const nominal = await Nominal.findOne({ _id: id });

  //       res.render('admin/nominal/edit', {
  //         nominal,
  //       });
  //     } catch (err) {
  //       req.flash('alertMessage', `${err.message}`);
  //       req.flash('alertStatus', 'danger');
  //       res.redirect('/nominal');
  //       log(err);
  //     }
  //   },
  //   actionEdit: async (req, res) => {
  //     try {
  //       const { id } = req.params;
  //       const { coinName, coinQuantity, price } = req.body;
  //       await Nominal.findOneAndUpdate({ _id: id }, { coinName, coinQuantity, price });

  //       req.flash('alertMessage', 'Berhasil mengubah nominal');
  //       req.flash('alertStatus', 'success');

  //       res.redirect('/nominal/');
  //     } catch (err) {
  //       req.flash('alertMessage', `${err.message}`);
  //       req.flash('alertStatus', 'danger');
  //       res.redirect('/nominal');
  //       log(err);
  //     }
  //   },
  //   actionDelete: async (req, res) => {
  //     try {
  //       const { id } = req.params;
  //       await Nominal.findOneAndDelete({ _id: id });

  //       req.flash('alertMessage', 'Berhasil menghapus nominal');
  //       req.flash('alertStatus', 'success');

//       res.redirect('/nominal/');
//     } catch (err) {
//       req.flash('alertMessage', `${err.message}`);
//       req.flash('alertStatus', 'danger');
//       res.redirect('/nominal');
//       log(err);
//     }
//   },
};
