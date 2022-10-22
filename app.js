const express = require('express');
const Http = require('http');
const routes = require('./routes');
require('dotenv').config();
var cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.js');


const port = process.env.EXPRESS_PORT;
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/authMiddleware');
const app = express();
const http = Http.createServer(app);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);
app.use(cors({
  origin: '*', // 출처 허용 옵션
  credential: 'true' // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
}));

app.get('/', (req, res) => {
  res.send("hello!")
})

//가짜 authMiddleware 테스트기
app.post('/authMiddlewareTest', authMiddleware, (req, res) => {
  const result = req.body
  const { userId } = res.locals.user;
  res.send({ result, userId })
})

//Post만드는 기계
const { User, Post } = require('./models');
app.post('/postMaker', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { title, content } = req.body;
    const { nickname } = await User.findByPk(userId);
    const data = await Post.create({ userId, nickname, title, content });
    return res.status(200).json({ data })
  } catch (error) {
    console.log(error.name + ':' + error.message);
  }
})
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

http.listen(port, () => {
  console.log(`${port}로 MINI 서버가 열렸습니당`);
});

module.exports = http;
