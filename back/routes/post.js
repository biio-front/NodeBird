const express = require('express');
const { Post, Comment, User, Image, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();
const multer = require('multer');
const { diskStorage } = require('multer');
const path = require('path');  // 노드에서 제공하는 모듈
const fs = require('fs');  // 파일 시스템을 조작할수있는 모듈
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'biio-nodebird',
    key(req, file, cb) {
      cb(null, `original/${Date.now()} ${path.basename(file.originalname)}`) //original폴더/파일이름
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 용량제한 20Mb
});

// const upload = multer({
//   storage: diskStorage({  // 어디에 저장할 것인가? 일단은 하드디스크
//     destination(req, file, done) {
//       done(null, 'uploads');   // 업로즈 폴더에...
//     },
//     filename(req, file, done) {  // 비오.png
//       const ext = path.extname(file.originalname);  //확장자 추출(png)
//       const basename = path.basename(file.originalname, ext); // 비오
//       done(null, basename + '_' + new Date().getTime() + ext); // 비오1234(시간초).png
//     }
//   }),
//   limits: { fileSize: 20 * 1024 * 1024 }, // 용량제한 20Mb
// });
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      // slice(1) 해서 #을 없애줌.
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({ 
        where: { name: tag.slice(1).toLowerCase() },
      }))); // findOrCreate는 [노드, true], [리액트, false] 이런식으로 반환.
      await post.addHashtags(result.map(v => v[0]))
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) { // 이미지를 여러개 올리면 배열
        // 시퀄라이즈 모델에 만들어서 넣어줌. (파일 이름을 넣어줌.)
        const image = await Promise.all(req.body.image.map(image => Image.create({ src: image }))); 
        await post.addImages(image);
      } else {  // 이미지를 하나 올리면 image: 비오.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image); // 관계함수. post.addImages(Image테이블데이터) 혹은 post.addImages(Image id)
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User, // 댓글 작성자
          attributes: ['id', 'nickname'],
        }]
      }, {
        model: User,  // 게시글 작성자
        attributes: ['id', 'nickname'],
      }, {
        model: User,  // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }]
    })
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => { //POST /post/images
  try {
    console.log(req.files);
    res.json(req.files.map(v => v.location.replace(/\/origin\//, '/thumb/'))); 
    // location에 주소자체가 들어있음. 주소에 origin이있으면 thumb로 바꿔줌. 원본대신 리사이징 된 이미지 가져오기.
    // res.json(req.files.map(v => v.filename));
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where : { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).json('존재하지 않는 페이지입니다.');
    }
    const fullPost = await Post.findOne({
      where: { id: post.id},
      include: [{
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
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({ 
      where: { 
        id: req.params.postId,
        UserId: req.user.id,
      } 
    });
    res.status(200).send(req.params.postId);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { 
        id: req.body.postId,
      }
    });
    if(!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    const comment = await Comment.create({
      content: req.body.comment,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }]
    })
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {  // PATCH /post/1/like
  try {
    const post = await Post.findOne({ where: { id: parseInt(req.params.postId, 10)}});
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id);
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {  // DELETE /post/1/like
  try {
    const post = await Post.findOne({ where: { id: parseInt(req.params.postId, 10)}});
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ 
      where: { id: parseInt(req.params.postId, 10) },
      include: [{
        model: Post,
        as: 'Retwee',
      }],
    });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    // 내가쓴글 리트윗 못하게,  내 포스트를 리트윗한 포스트 리트윗 안되게.
    if (req.user.id === post.UserId || (post.Retwee && post.Retwee.UserId === req.user.id)) {
      return res.status(403).send('자신의 글을 리트윗할 수 없습니다.');
    } 
    const retweeTargetId = post.RetweeId || post.id; // 원포스트를 리트윗
    // 내가 리트윗하려는 포스트를 이미 리트윗했었다면? ^^
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweeId: retweeTargetId,
      }
    });
    if (exPost) {
      return res.status(403).send('이미 리트윗했습니다.');
    }
    const retwee = await Post.create({
      UserId: req.user.id,
      RetweeId: retweeTargetId,
      content: 'retwee',
    });
    const retweeWithPrevPost = await Post.findOne({
      where: { id: retwee.id },
      include: [{
        model: Post,
        as: 'Retwee',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }]
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }]
    });
    res.status(201).json(retweeWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
