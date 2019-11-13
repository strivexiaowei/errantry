const router = require('express').Router();
const expressWs = require('express-ws');
expressWs(router);
const multer = require('multer');
let path = require('path');
const storage = multer.diskStorage({
  //文件存储位置
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../uploads/tmp/'));
  },
  //文件名
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}_${Math.ceil(
        Math.random() * 1000
      )}_multer.${file.originalname.split('.').pop()}`
    );
  }
});
const uploadCfg = {
  storage: storage,
  limits: {
    //上传文件的大小限制,单位bytes
    fileSize: 1024 * 1024 * 20
  }
};
const db = require('./db');
router.get('/login', function(req, res) {
  let name = req.query.name;
  let password = req.query.password;
  let opts = {
    name,
    password
  };
  db.login(opts, function(result) {
    if (result) {
      res.send({
        code: 200,
        msg: '登录成功,写的第一个接口',
        info: result
      });
    } else {
      res.send({
        code: 400,
        msg: '请输入正确的用户名和密码'
      });
    }
  });
});
router.post('/register', function(req, res) {
  let opts = req.body;
  console.log(opts);
  db.register(opts, function(result) {
    if (result) {
      res.send({
        code: 200,
        msg: '注册成功',
        info: result
      });
    } else {
      res.send({
        code: 400,
        msg: '注册失败'
      });
    }
  });
});
router.get('/queryUserById', function(req, res) {
  let _id = req.query.id;
  db.queryUserById(_id, function(result) {
    if (result) {
      res.send({
        code: 200,
        msg: '查询账户成功',
        info: result
      });
    } else {
      res.send({
        code: 400,
        msg: '没有查询到当前id的账户'
      });
    }
  });
});
/**
 * 查询聊天信息
 */
router.ws('/queryMsg', function(ws, req) {
  ws.on('message', function(msg) {
    const opts = JSON.parse(msg);
    ws.send('dadadad')
    db.queryMsg(opts, function(result) {
      if (result) {
        ws.send(JSON.stringify(result));
      } else {
        ws.send('发送失败');
      }
    });
  });
});

router.post('/upload', async (req, res) => {
  let upload = multer(uploadCfg).any();
  upload(req, res, async err => {
    if (err) {
      res.json({
        path: `//uploads/tmp/${uploadFile.filename}`
      });
      console.log(err);
      return;
    }
    console.log(req.files);
    let uploadFile = req.files[0];
    res.json({
      path: `//uploads/tmp/${uploadFile.filename}`
    });
  });
});
router.ws('/roomlist', function(ws, req) {
  ws.on('message', function(msg) {
    const opts = JSON.parse(msg);
    db.roomlist(opts, function(result) {
      if (result) {
        ws.send(JSON.stringify(result));
      } else {
        ws.send('获取用户失败');
      }
    });
  });
});
module.exports = router;
