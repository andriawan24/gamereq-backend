const { log } = require('debug/src/node');

module.exports = {
  index: async (req, res) => {
    try {
      res.render('index');
    } catch (err) {
      log(err);
    }
  },
};
