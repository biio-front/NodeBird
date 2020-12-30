const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const passport = require('passport');
const db = require('../models');

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.err(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: { 
          exclude: ['password'] 
        },
        include: [{
          model: db.Post,
        }, {
          model: db.User,
          as: 'Followings',
        }, {
          model: db.User,
          as: 'Followers', // 모델에서 as 사용했으면 똑같은 이름으로 as사용.
        }]
      })
      return res.status(200).json(fullUserWithoutPassword);
    })
  })(req, res, next);
});

router.post('/', async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword
    });
    res.status(201).send('ok');
  } catch(error) {
    console.log(error);
    next(error);
  }
});

router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send('ok');
})

module.exports = router;
