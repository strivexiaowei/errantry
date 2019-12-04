const express = require("express");
const expressWs = require("express-ws");
const app = express();
expressWs(app);
const bodyParser = require("body-parser");
const router = require("./router");
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(express.static('upload')); // 这个很重要，必须要这个才能拿到图片链接，而不是进入路由，有兴趣的同学可以删掉试验一下
app.use('/upload',express.static('upload'));
app.use(bodyParser.json());
// 中间件, 我整个服务器的接口全部允许跨域;
app.use(function(req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

app.use(router);

app.listen(80, function() {
  console.log("服务端已经上线了,请访问：http://localhost: 80");
});
