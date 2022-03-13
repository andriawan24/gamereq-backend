const path = require('path');
const fs = require('fs');
const config = require('../../config');
const Player = require('../player/model');

module.exports = {
  signup: async (req, res, next) => {
    try {
      const payload = req.body;

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
            const player = new Player({ ...payload, avatar: filename });

            await player.save();

            delete player._doc.password;

            res.status(201).json({
              data: player,
            });
          } catch (err) {
            if (err && err.name === 'ValidationError') {
              res.status(422).json({
                message: err.message,
                fields: err.errors,
              });
            }
            next(err);
          }
        });
      } else {
        const player = new Player(payload);

        await player.save();

        delete player._doc.password;

        res.status(201).json({
          data: player,
        });
      }

      res.status(201).json({
        message: payload,
      });
    } catch (err) {
      if (err && err.name === 'ValidationError') {
        res.status(422).json({
          message: err.message,
          fields: err.errors,
        });
      }
      next(err);
    }
  },
};
