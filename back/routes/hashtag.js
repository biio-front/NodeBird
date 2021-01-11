const express = require('express');
const router = express.Router();
const { User, Post, Comment, Image, Hashtag } = require('../models');
const { Op } = require('sequelize');

router.get('/:hashtag/posts', async (req, res, next) => { // GET /hashtag/tag/posts
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) { //초기로딩이 아닐경우(스크롤 후 로딩)
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }
    } // Op.lt === id가 lastId보다 작은
    const posts = await Post.findAll({
      where,
      limit: 5,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: Hashtag,
        where: { name: decodeURIComponent(req.params.hashtag) },
      },{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retwee',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }],
      }]
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;