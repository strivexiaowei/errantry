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
})
const upload = multer({storage: storge});
router.post('/BBS/createDynamic', function (req, res) {
  const opts = req.body;
  console.log(opts);
  opts.createTime = +Date.now();
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
  db.addFileImage(req.files[0], function (result) {
    console.log(result);
    res.json(result);
  });
});

router.get('/uploads/images/*', function(req, res) {
  console.log(req.url);
  const reqUrlArr = req.url.split('/');
  if (reqUrlArr[reqUrlArr.length - 1] === 'view') {
    let _id =  reqUrlArr.splice(-2)[0];
    db.queryFileById(_id, function (result) {
      res.sendFile( __dirname + "/" + result.path);
    });
  }
});
module.exports = router;
