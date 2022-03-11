const { log } = require('debug/src/node');
const Category = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };
      const categories = await Category.find();
      res.render('admin/category/view_category', {
        categories,
        alert,
        name: req.session.user.name,
        title: 'Halaman Kategori',
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
      log(err);
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render('admin/category/create', {
        name: req.session.user.name,
        title: 'Halaman Tambah Kategori',
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
      log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category({ name });
      await category.save();

      req.flash('alertMessage', 'Berhasil menambah kategori');
      req.flash('alertStatus', 'success');

      res.redirect('/category/');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
      log(err);
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });

      res.render('admin/category/edit', {
        category,
        name: req.session.user.name,
        title: 'Halaman Edit Kategori',
      });
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
      log(err);
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await Category.findOneAndUpdate({ _id: id }, { name });

      req.flash('alertMessage', 'Berhasil mengubah kategori');
      req.flash('alertStatus', 'success');

      res.redirect('/category/');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
      log(err);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Category.findOneAndDelete({ _id: id });

      req.flash('alertMessage', 'Berhasil menghapus kategori');
      req.flash('alertStatus', 'success');

      res.redirect('/category/');
    } catch (err) {
      req.flash('alertMessage', `${err.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
      log(err);
    }
  },
};
