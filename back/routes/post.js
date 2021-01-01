const express = require('express');
const { Post, Comment, User, Image } = require('../models');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();

router.post('/', async (req, res, next) => {
  console.log(req.user);
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Image,
      }, {
        model: Comment,
      }, {
        model: User,
      }]
    })
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/', (req, res) => {
  res.json({id: 1});
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const comment = await Comment.create({
      content: req.body.Comment,
      PostId: req.params.postId,
      UserId: req.user.id,
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
