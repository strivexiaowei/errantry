const router = require('express').Router();
const expressWs = require('express-ws');
expressWs(router);
let path = require('path');
const uuid = require('uuid');
const multer = require('multer');
const db = require('./db');
const storge = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/images')
  },
  filename: function (req, file, cb) {
      var fileformat = (file.originalname).split('.');
      cb(null, file.fieldname+'-'+Date.now()+'.'+fileformat[fileformat.length-1]);
  }
});
const upload = multer({storage: storge});
router.post('/BBS/dynamicList', function (req, res) {
  const opts = req.body;
  db.queryDynamicList(opts, function (result) {
    res.json(result);
  });
});
router.post('/BBS/createDynamic', function (req, res) {
  const opts = req.body;
  console.log(opts);
  opts.createTime = +Date.now();
  opts.type = "Dy";
  db.addDynamic(opts, function (result) {
    if (result) {
      res.json({
        code: 1,
        desc: '创建动态成功！'
      });
    }
  })
});

router.post('/BBS/uploads', upload.array('file',20), function (req, res) {
  console.log(req.files[0]);
  db.addFileImage(req.files[0], function (result) {
    res.json(result);
  });
});

router.get('/uploads/images/*', function(req, res) {
  const reqUrlArr = req.url.split('/');
  if (reqUrlArr[reqUrlArr.length - 1] === 'view') {
    let _id =  reqUrlArr.splice(-2)[0];
    db.queryFileById(_id, function (result) {
      res.sendFile( __dirname + "/" + result.path);
    });
  }
});

router.post('/BBS/register', function(req, res) {
  const opts = req.body;
  db.registerBBS(opts,function (result) {
    res.json(result);
  });
});
router.post('/BBS/login', function(req, res) {
 const opts = req.body;
 db.loginBBS(opts, function (result) {
   if (result) {
     res.json({
       code: 1,
       desc: '登录成功',
       result
     });
   } else {
     res.json({
       code: 2,
       desc: '登录失败'
     })
   }
 });
});
router.post('/BBS/appLogin', function (req, res) {
  const opts = req.body;
  db.loginBBS(opts, function (result) {
    if (result) {
      res.json({
        code: 1,
        desc: '登录成功'
      });
    } else {
      db.addLogin(opts, function (json) {
        res.json({
          code: 1,
          desc: '登录成功'
        });
      })
    }
  })
});
router.post('/BBS/getMsgList', function (req, res) {
  const opts = {};
  db.queryAllMsg(opts, function (result) {
    res.json(result);
  });
});
router.ws('/BBS/getMsg', function (ws, req) {
  ws.on('message', function(msg) {
    const opts =  JSON.parse(msg);
    db.addOneRoomMsg(opts, function (result) {
      if (result) {
        ws.send(msg);
      }
    });
  });
})
module.exports = router;
