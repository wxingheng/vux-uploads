/*
 * @Author: wuxh
 * @Date: 2019-04-30 12:38:45
 * @LastEditTime: 2020-07-02 17:43:16
 * @LastEditors: wuxh
 * @Description:
 * @FilePath: /node-upload/app.js
 */

var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var multipart = require('connect-multiparty')
var fs = require('fs')

var app = express()
var router = express.Router()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// // 自定义跨域中间件
var allowCors = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
}
app.use(allowCors) //使用跨域中间件
//设置跨域访问
// app.all('*', (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By",' 3.2.1')
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// 正常使用相对目录
app.use(express.static(path.join(__dirname, 'public')))

// docker 挂载使用绝对路径
// sudo docker run --name node-upload -v /nginx/html/fed/fed-upload:/usr/src/app/public -d -p 3002:3000 node-upload:v1.0
// app.use(express.static( "/usr/src/app/public"));

router.post('/upload', multipart(), function (req, res, next) {
  var filename =
    req.files.file.originalFilename || path.basename(req.files.file.path)
  // var filename = req.files.files.originalFilename || path.basename(req.files.files.path)
  if (!/.*\.(jpg|gif|bmp|png|txt)$/gi.test(filename)) {
    return res.json({ code: 401, msg: '上传文件格式不被支持' })
  }
  var fi = filename.substr(filename.lastIndexOf('.')),
    targetPath
  var newName = new Date().getTime() + fi

  if (fi === '.txt') {
    targetPath = path.dirname(__filename) + '/logs/android_log/' + filename
  } else {
    targetPath = path.dirname(__filename) + '/public/images/' + newName
  }
  fs.createReadStream(req.files.file.path).pipe(
    fs.createWriteStream(targetPath)
  )
  res.json({
    code: 200,
    msg: { url: 'http://' + req.headers.host + '/images/' + newName }
  })
})

app.use(router)
app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
