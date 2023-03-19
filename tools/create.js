const chalk = require('chalk')
console.log(chalk)
const fs = require('fs')
const join = require('path').join
const mkdirp = require('mkdirp')
const readlineSync = require('readline-sync')
const services = require('./create-utils')
const { camelCase, upperFirst, kebabCase } = require('lodash')
const types = [
  'page            /一个页面',
  'module          / 二级模块',
  'view            / 一级模块',
  'component       / 公用组件，应以s-开头',
  'component-app   / 业务组件',
  'page-component  / 模块内组件',
]
const index = readlineSync.keyInSelect(types, 'create what? please input number...', { cancel: true })
let dir = ''

const writeFileOrWarn = (file, data) => {
  if (fs.existsSync(file)) {
    // eslint-disable-next-line
    console.warn(chalk.red(`warn: ${file} already exists`))
  } else {
    fs.writeFileSync(file, data)
  }
}
//获取用户输入的组件模式
const getMode = () => {
  return readlineSync.keyInSelect(['common', 'list-template'], 'please choose component mode', {
    cancel: true,
  })
}
//获取用户输入的组件名
const getComponentName = () => {
  let componentName = readlineSync.question('please input a component name\r\n')
  if (!componentName) {
    // eslint-disable-next-line
    console.log('please input name (╯°Д°)╯︵ ┻━┻ ')
    return false
  }
  return kebabCase(componentName)
}
//创建组件
const createFile = (myDir, register = false) => {
  let componentName = getComponentName()
  if (!componentName) {
    return
  }
  myDir = join(__dirname, myDir + componentName)
  const pascalName = upperFirst(camelCase(componentName))
  mkdirp(myDir)
    .then(() => {
      const mode = getMode()
      if (mode == 0) {
        //单文件模式
        writeFileOrWarn(join(myDir, `index.vue`), services.pages.indexVue(pascalName))
      } else {
        writeFileOrWarn(join(myDir, `index.vue`), services.list.indexVue(pascalName))
      }
      // TODO:
      // if (register) {
      //   // 当生成公共组件时，重新生成组件注册文件
      //   const { execFile } = require('child_process')
      //   execFile('node', ['./tools/register-component/index'])
      // }
    })
    .catch(err => {
      console.warn(chalk.red(err))
    })
}
//选择一个二级模块的路径
const getModuleDir = idx => {
  // eslint-disable-next-line
  console.log('will create ' + chalk.blue(types[idx]) + ' at')
  let views = fs.readdirSync(join(__dirname, '../src/views'))
  let fileIndex = readlineSync.keyInSelect(views, 'please choose a view', { cancel: true })
  let module = fs.readdirSync(join(__dirname, '../src/views/' + views[fileIndex]))
  let moduleIndex = readlineSync.keyInSelect(module, 'please choose a module', { cancel: true })
  // eslint-disable-next-line
  console.log(
    'will create a component at ' +
      chalk.blue('@/views/' + views[fileIndex] + '/' + module[moduleIndex] + '/components')
  )
  dir = '../src/views/' + views[fileIndex] + '/' + module[moduleIndex]
  return dir
}
//创建一个页面
if (index === 0) {
  dir = getModuleDir(index) + '/pages/'
  createFile(dir)
}
//创建一个二级模块
if (index === 1) {
  // eslint-disable-next-line
  console.log('will create ' + chalk.blue(types[index]) + ' at')
  let views = fs.readdirSync(join(__dirname, '../src/views'))
  let fileIndex = readlineSync.keyInSelect(views, 'please choose a view', { cancel: true })
  let moduleName = readlineSync.question('please input a module name\r\n')
  if (!moduleName) {
    // eslint-disable-next-line
    console.log('please input name (╯°Д°)╯︵ ┻━┻ ')
    return false
  }
  let tDir = '../src/views/' + views[fileIndex] + '/' + moduleName
  dir = join(__dirname, tDir)
  mkdirp(dir)
    .then(() => {
      mkdirp(join(__dirname, tDir + '/components')).catch(err => {
        err && console.log(err)
      })
      mkdirp(join(__dirname, tDir + '/pages')).catch(err => {
        err && console.log(err)
      })
      writeFileOrWarn(join(dir, `router.ts`), services.router(camelCase(moduleName)))
    })
    .catch(err => {
      if (err) {
        console.warn(chalk.red(err))
      }
    })
}
//创建一个一级模块
if (index === 2) {
  let viewName = readlineSync.question('please input a view name\r\n')
  if (!viewName) {
    // eslint-disable-next-line
    return console.log('please input name (╯°Д°)╯︵ ┻━┻ ')
  }
  let tDir = '../src/views/' + viewName
  dir = join(__dirname, tDir)
  mkdirp(dir).catch(err => {
    if (err) {
      console.warn(chalk.red(err))
    }
  })
}
//创建一个公用组件
if (index === 3) {
  dir = '../src/components/'
  createFile(dir, true)
}
//创建一个公用业务组件
if (index === 4) {
  dir = '../src/components-app/'
  createFile(dir)
}
//创建一个模块内组件
if (index === 5) {
  dir = getModuleDir(index) + '/components/'
  createFile(dir)
}
