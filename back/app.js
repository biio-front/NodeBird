const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const app = express();
const hpp = require('hpp');
const helmet = require('helmet');

dotenv.config();

db.sequelize.sync()
.then(() => console.log('db 연결 성공'))
.catch(console.error);
passportConfig(); // passport 설정

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // 쟈세한 로그 기록 (접속자 ip까지 보여줌)
  app.use(hpp()); // 보안을 위해서 필요함
  app.use(helmet());
} else {
  app.use(morgan('dev')); // 로그남기는 미들웨어(morgan)
}

app.use(cors({
  origin: ['http://localhost:3060', 'http://biio-bird.ga'],
  credentials: true
}));
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json()); // 바디 파서 설정
app.use(express.urlencoded({extended: true})); // 바디 파서 설정
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false, // 세션 강제 저장
  resave: false, // 빈 세션값 저장
  secret: process.env.COOKIE_SECRET, // 쿠키 암호화
  cookie: {
    httpOnly: true, // httpOnly : 자바스크립트에서 쿠키 접근 금지
    secure: false, // https 사용시 true
    domain: process.env.NODE_ENV === 'production' && '.biio-gird.ga'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/hashtag', hashtagRouter);

app.listen(80, () => {
  console.log('서버 실행 중');
});
