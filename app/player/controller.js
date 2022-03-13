const Voucher = require('../voucher/model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const Payment = require('../payment/model');
const Bank = require('../bank/model');
const Transaction = require('../transaction/model');

module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .select('_id name status category thumbnail')
        .populate('category', '_id name');

      res.status(200).json({
        data: voucher,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || 'Internal server error',
      });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id })
        .populate('category', '_id name')
        .populate('nominals')
        .populate('user', '_id name phoneNumber');

      if (!voucher) {
        return res.status(404).json({
          message: 'Voucher game tidak ditemukan!',
        });
      }

      return res.status(200).json({
        data: voucher,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message || 'Internal server error',
      });
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find();

      return res.status(200).json({
        data: category,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message || 'Internal server error',
      });
    }
  },
  checkout: async (req, res) => {
    try {
      const {
        accountNumber, name, nominal, voucher, payment, bank,
      } = req.body;

      const resVoucher = await Voucher.findOne({ _id: voucher })
        .select('name category _id thumbnail user')
        .populate('category')
        .populate('user');

      if (!resVoucher) {
        return res.status(500).json({
          message: 'Voucher tidak ditemukan',
        });
      }

      const resNominal = await Nominal.findOne({ _id: nominal });

      if (!resNominal) {
        return res.status(500).json({
          message: 'Payment tidak ditemukan',
        });
      }

      const resPayment = await Payment.findOne({ _id: payment });

      if (!resPayment) {
        return res.status(500).json({
          message: 'Bank tidak ditemukan',
        });
      }

      const resBank = await Bank.findOne({ _id: bank });

      if (!resBank) {
        return res.status(500).json({
          message: 'Nominal tidak ditemukan',
        });
      }

      const tax = (10 / 100) * resNominal._doc.price;
      const value = resNominal._doc.price - tax;

      const payload = {
        historyVoucherTopup: {
          gameName: resVoucher._doc.name,
          category: resVoucher._doc.category ? resVoucher._doc.category.name : '',
          thumbnail: resVoucher._doc.thumbnail,
          coinName: resNominal._doc.coinName,
          coinQuantity: resNominal._doc.coinQuantity,
          price: resNominal._doc.price,
        },
        historyPayment: {
          name: resBank._doc.name,
          type: resPayment._doc.type,
          bankName: resBank._doc.bankName,
          accountNumber: resBank._doc.accountNumber,
        },
        name,
        accountUser: accountNumber,
        tax,
        value,
        player: req.player._id,
        historyUser: {
          name: resVoucher._doc.user?.name,
          phoneNumber: resVoucher._doc.user?.phoneNumber,
        },
        category: resVoucher._doc.category?._id,
        user: resVoucher._doc.user?._id,
      };

      const transaction = new Transaction(payload);

      await transaction.save();

      return res.status(200).json({
        data: transaction,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message || 'Internal server error',
      });
    }
  },
};
