const express = require("express");
const expressWs = require('express-ws');
const app = express();
expressWs(app);
const bodyParser = require("body-parser");
const router = require("./router");
const mutipart= require('connect-multiparty');
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
//中间件,我整个服务器的接口全部允许跨域
app.use(function (req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

app.use(router);

app.listen(999, function () {
  console.log("服务端已经上线了,请访问：http://localhost:999");
})