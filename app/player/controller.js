const path = require('path');
const fs = require('fs');
const Voucher = require('../voucher/model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const Payment = require('../payment/model');
const Bank = require('../bank/model');
const Transaction = require('../transaction/model');
const Player = require('./model');
const config = require('../../config');

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
  history: async (req, res) => {
    try {
      const { status = '' } = req.query;

      let criteria = {};

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: 'i' },
        };
      }

      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }

      const history = await Transaction.find(criteria);

      const total = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: '$value' },
          },
        },
      ]);

      return res.status(200).json({
        data: history,
        total: total.length ? total[0].value : null,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message || 'Internal server error',
      });
    }
  },
  historyDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const history = await Transaction.findOne({ _id: id });

      if (!history) {
        return res.status(404).json({
          message: 'Transaksi tidak ditemukan',
        });
      }

      return res.status(200).json({
        data: history,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message || 'Internal server error',
      });
    }
  },
  dashboard: async (req, res) => {
    try {
      const count = await Transaction.aggregate([
        { $match: { player: req.player._id } },
        {
          $group: {
            _id: '$category',
            value: { $sum: '$value' },
          },
        },
      ]);

      const category = await Category.find();

      category.forEach((e) => {
        count.forEach((data) => {
          if (data._id.toString() === e._id.toString()) {
            // eslint-disable-next-line no-param-reassign
            data.name = e.name;
          }
        });
      });

      const history = await Transaction.find({ player: req.player._id })
        .populate('category')
        .sort({ updatedAt: -1 });

      return res.status(200).json({
        data: history,
        count,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message || 'Internal server error',
      });
    }
  },
  profile: async (req, res) => {
    try {
      const player = {
        id: req.player._id,
        username: req.player.username,
        email: req.player.email,
        name: req.player.name,
        avatar: req.player.avatar,
        phone_number: req.player.phoneNumber,
      };
      return res.status(200).json({ data: player });
    } catch (err) {
      return res.status(500).json({
        message: err.message || 'Internal server error',
      });
    }
  },
  editProfile: async (req, res) => {
    try {
      const { name = '', phoneNumber = '' } = req.body;

      const payload = {};

      if (name.length) payload.name = name;
      if (phoneNumber.length) payload.phoneNumber = phoneNumber;

      if (req.file) {
        const tmpPath = req.file.path;
        const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        const filename = `${req.file.filename}.${originalExt}`;
        const targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`);

        const src = fs.createReadStream(tmpPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);

        src.on('end', async () => {
          const player = await Player.findOne({ _id: req.player.id });

          const currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          await Player.findOneAndUpdate({
            _id: req.player.id,
          }, {
            ...payload,
            avatar: filename,
          }, { new: true, runValidators: true });

          res.status(201).json({
            data: {
              id: player.id,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            },
          });
        });
      } else {
        const player = await Player.findOneAndUpdate({
          _id: req.player._id,
        }, payload, { new: true, runValidators: true });

        res.status(201).json({
          data: {
            id: player.id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message || 'Internal server error',
      });
    }
  },
};
