const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
  signin: async (req, res, next) => {
    const { email, password } = req.body;

    Player.findOne({ email }).then((player) => {
      if (player) {
        const checkPassword = bcrypt.compareSync(password, player.password);

        if (checkPassword) {
          const token = jwt.sign({
            player: {
              id: player.id,
              username: player.username,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            },
          }, config.jwtKey);

          res.status(200).json({
            data: { token },
          });
        } else {
          res.status(403).json({
            message: 'Silahkan cek email/password anda',
          });
        }
      } else {
        res.status(403).json({
          message: 'Silahkan cek email/password anda',
        });
      }
    }).catch((err) => {
      res.status(500).json({
        message: err.message || 'Internal server error',
      });
    });
  },
};
