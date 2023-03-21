var express = require('express')
// var request = require('request')
var bodyParser = require('body-parser')
// var multer = require('multer');
// var is = require('type-is')
var fs = require('fs')
var path = require('path')
//
var server = express()
var { getTreeData, creatPage } = require('../create-list/common')
//配置路由监听
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))

var router = express.Router()

router.use('/fe-dev/file', (req, res) => {
  let file = req.originalUrl.split('/file/').pop()
  let dirs = fs.readdirSync(path.join(__dirname, '../../src/views/a-test/pages/demo/components/' + file))
  let contents = {}
  dirs.forEach(dir => {
    let _path = path.join(__dirname, `../../src/views/a-test/pages/demo/components/${file}/${dir}/index.vue`)
    if (fs.existsSync(_path)) {
      contents[dir] = fs.readFileSync(_path).toString()
    }
  })
  res.json({
    data: contents,
  })
})
router.post('/fe-dev/clist', (req, res) => {
  try{
  let { body: obj } = req
  creatPage(obj)
  res.json({
    data: 'ok',
    code:200
  })}catch{
    res.json({
      code:999,
      msg:'发生异常，把你的参数给我看看'
    })
  }
})
router.get('/fe-dev/apis/tree', (req, res) => {
  const projectPath = req.query.projectPath;
  try{
    const data=getTreeData(projectPath)
    res.json({
      data ,
      code:200
    })
  }catch{
    res.json({
      code:999,
      msg:'解析地址失败,请确认你输入的path绝对路径'
    })
  }
})

server.use('/', router)

module.exports = server.listen(10086, 'localhost', function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:10086'
  console.log('Listening at ' + uri + '/\n')
})
