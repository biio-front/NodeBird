const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Post } = require('../models');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.get('/', async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: { 
          exclude: ['password'] ,
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers', 
          attributes: ['id'],
        }]
      })
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
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
        where: { id: req.user.id },
        attributes: { 
          exclude: ['password'] 
        },
        include: [{
          model: db.Post,
          attributes: ['id'],
        }, {
          model: db.User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: db.User,
          as: 'Followers', 
          attributes: ['id'],
        }] // 모델에서 as 사용했으면 똑같은 이름으로 as사용.
      })
      return res.status(200).json(fullUserWithoutPassword);
    })
  })(req, res, next);
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
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

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send('ok');
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update({
      nickname: req.body.nickname,
    }, {
      where: { id: req.user.id },
    });
    res.status(200).json(req.body.nickname);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId }}); // 작성자
    if (!user) {
      return res.status(403).send('존재하지 않는 유저입니다.');
    }
    await user.addFollowers(req.user.id); // 작성자 팔로워에 나 더하기
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); // 작성자id 응답
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId }}); 
    if (!user) {
      return res.status(403).send('존재하지 않는 유저입니다.');
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId }}); // 팔로워
    if (!user) {
      return res.status(403).send('나를 팔로우하지 않는 사용자입니다.');
    }
    await user.removeFollowings(req.user.id); // 팔로워의 팔로잉목록에서 나를 삭제
    res.status(200).json({ UserId: parseInt(req.params.userId, 10)});  // 팔로워 응답
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.get('/followers', isLoggedIn, async (req, res, next) => { //Get /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id }}); // me
    const followers =  await user.getFollowers({attributes: ['nickname', 'id']}); 
    res.status(200).json({ followers }); 
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/followings', isLoggedIn, async (req, res, next) => { //Get /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id }}); // me
    const followings = await user.getFollowings({attributes: ['nickname', 'id']}); 
    res.status(200).json({ followings }); 
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.get('/:userId', async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: Post,
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id'],
      }]
    });
    if (!fullUserWithoutPassword) {
      return res.status(404).json('존재하지 않는 사용자입니다.');
    }
    const data = fullUserWithoutPassword.toJSON();
    data.Posts = data.Posts.length;
    data.Followings = data.Followings.length;
    data.Followers = data.Followers.length;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
