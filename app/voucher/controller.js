const { log } = require('debug/src/node');
const path = require('path');
const fs = require('fs');
const config = require('../../config');
const Voucher = require('./model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };
      const vouchers = await Voucher.find()
        .populate('category')
        .populate('nominals');
      res.render('admin/voucher/view_voucher', {
        vouchers,
        alert,
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
      log(err);
    }
  },
  viewCreate: async (req, res) => {
    try {
      const categories = await Category.find();
      const nominals = await Nominal.find();
      res.render('admin/voucher/create', {
        categories,
        nominals,
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
      log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, nominals, category } = req.body;
      if (req.file) {
        const tmpPath = req.file.path;
        const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        const filename = `${req.file.filename}.${originalExt}`;
        const targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`);

        const src = fs.createReadStream(tmpPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);

        src.on('end', async () => {
          try {
            const voucher = new Voucher({
              name,
              category,
              nominals,
              thumbnail: filename,
            });

            await voucher.save();

            req.flash('alertMessage', 'Berhasil menambah voucher');
            req.flash('alertStatus', 'success');

            res.redirect('/voucher');
          } catch (err) {
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
            log(err);
          }
        });
      } else {
        const voucher = new Voucher({
          name,
          category,
          nominals,
        });

        await voucher.save();

        req.flash('alertMessage', 'Berhasil menambah voucher');
        req.flash('alertStatus', 'success');

        res.redirect('/voucher');
      }
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
      log(err);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const categories = await Category.find();
      const nominals = await Nominal.find();
      const voucher = await Voucher.findOne({ _id: id })
        .populate('category')
        .populate('nominals');

      res.render('admin/voucher/edit', {
        voucher,
        categories,
        nominals,
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
      log(err);
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, nominals, category } = req.body;
      if (req.file) {
        const tmpPath = req.file.path;
        const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        const filename = `${req.file.filename}.${originalExt}`;
        const targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`);

        const src = fs.createReadStream(tmpPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);

        src.on('end', async () => {
          try {
            const voucher = await Voucher.findOne({ _id: id });

            const currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
            log(`image is ${currentImage}`);
            if (fs.existsSync(currentImage)) {
              log('Apus image');
              fs.unlinkSync(currentImage);
            }

            await Voucher.findOneAndUpdate({
              _id: id,
            }, {
              name,
              category,
              nominals,
              thumbnail: filename,
            });

            req.flash('alertMessage', 'Berhasil ubah voucher');
            req.flash('alertStatus', 'success');

            res.redirect('/voucher');
          } catch (err) {
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
            log(err);
          }
        });
      } else {
        log('Go to else');
        await Voucher.findOneAndUpdate({
          _id: id,
        }, {
          name,
          category,
          nominals,
        });

        req.flash('alertMessage', 'Berhasil ubah voucher');
        req.flash('alertStatus', 'success');

        res.redirect('/voucher');
      }
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
      log(err);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findOneAndDelete({ _id: id });

      const currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      req.flash('alertMessage', 'Berhasil menghapus voucher');
      req.flash('alertStatus', 'success');

      res.redirect('/voucher/');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
      log(err);
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findOne({ _id: id });
      const status = voucher.status === 'Y' ? 'N' : 'Y';

      await Voucher.findOneAndUpdate({
        _id: id,
      }, {
        status,
      });

      req.flash('alertMessage', 'Berhasil ubah status voucher');
      req.flash('alertStatus', 'success');

      res.redirect('/voucher/');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
      log(err);
    }
  },
};
