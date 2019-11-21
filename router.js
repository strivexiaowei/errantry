const router = require('express').Router();
const expressWs = require('express-ws');
expressWs(router);
let path = require('path');
const uuid = require('uuid');
const multer = require('multer');
const db = require('./db');
const storge = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
      var fileformat = (file.originalname).split('.');
      cb(null, file.fieldname+'-'+Date.now()+'.'+fileformat[fileformat.length-1]);
  }
})
const upload = multer({storage: storge});
// router.get('/login', function (req, res) {
//   let name = req.query.name;
//   let password = req.query.password;
//   let opts = {
//     name,
//     password
//   };
//   db.login(opts, function (result) {
//     if (result) {
//       res.send({
//         code: 200,
//         msg: '登录成功,写的第一个接口',
//         info: result
//       });
//     } else {
//       res.send({
//         code: 400,
//         msg: '请输入正确的用户名和密码'
//       });
//     }
//   });
// });

router.post('/BBS/createDynamic', upload.array('file',20), function (req, res) {
  // var form = new formidable.IncomingForm();//既处理表单，又处理文件上传
  //设置文件上传文件夹/路径，__dirname是一个常量，为当前路径
  // let uploadDir = path.join(__dirname, "./uploads/");
  // form.uploadDir = uploadDir;//本地文件夹目录路径

  // form.parse(req, (err, fields, files) => {
  //   console.log(files);
  //   // let oldPath = files.cover.path;//这里的路径是图片的本地路径
  //   // console.log(files.cover.name)//图片传过来的名字
  //   // let newPath = path.join(path.dirname(oldPath), files.cover.name);
  //   // //这里我传回一个下载此图片的Url
  //   // var downUrl = "http://localhost:" + listenNumber + "/uploads/" + files.cover.name;//这里是想传回图片的链接
  //   // fs.rename(oldPath, newPath, () => {//fs.rename重命名图片名称
  //   //   res.json({ downUrl: downUrl })
  //   // })
  // })
});
module.exports = router;
