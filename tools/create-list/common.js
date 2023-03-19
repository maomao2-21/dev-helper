const fs = require('fs')
const path = require('path')
const { getAPImsg } = require('./create-net')
const template = require('./creat_template')
function creatPage(params) {
  getAPImsg(params)
  const templet = template[params.listType](params)
  if (params.outPath) {
    const { outPath,projectPath } = params
    const currentDir = path.resolve(projectPath)
    const filename = path.join(currentDir, `/${outPath}`)
    mkdir(filename, templet)
  } else {
    const outputFilePath = path.join(__dirname, config[params.listType].name)

    fs.writeFileSync(outputFilePath, templet)
  }

  console.log('list.vue生成')
}
const config = {
  list_one: {
    name: 'list.vue',
    data: ['apiPath', 'columns'],
    templateName: 'list_one',
  },
  list_two: {
    name: 'list.vue',
    data: ['apiPath', 'buttons', 'columns'],
    templateName: 'list_two',
  },

  //这个是所有的配置 适合用按钮来create 可以忽略这个data
  list: {
    name: 'list.vue',
    data: ['apiPath', 'buttons', 'columns'],
    templateName: 'list',
  },
}

const mkdir = (filepath, templet) => {
  // 分离目录和文件名
  const dirname = path.dirname(filepath)
  const basename = path.basename(filepath)

  // 递归创建目录
  if (fs.existsSync(dirname)) {
    // 目录已存在，直接创建文件
    fs.writeFileSync(filepath, templet)
    return true
  } else {
    if (mkdir(dirname)) {
      // 创建目录成功，再创建文件
      fs.writeFileSync(filepath, templet)
      return true
    }
  }
}


function getFileInfo(filePath, parentPath) { 
  const stats = fs.statSync(filePath)
  const name = path.basename(filePath)
  const fullPath = parentPath ? `${parentPath}/${name}` : name

  if (name === 'types') {
    return null // 如果文件名为 "type"，返回 null
  }

  const node = { name, fullPath }

  if (stats.isFile()) {
    if (name.endsWith('.ts') && (name.toLowerCase().includes('list')||name.toLowerCase().includes('page'))) {
      // 将文件名转换为小写字母后，检查是否包含 "list"
      node.type = 'file'

    } else {
      return null // 否则返回 null，表示不添加到文件夹中
    }
  } else if (stats.isDirectory()) {
    node.type = 'folder'
    node.children = fs
      .readdirSync(filePath)
      .map(child => getFileInfo(path.join(filePath, child), fullPath))
      .filter(child => child !== null) // 过滤掉子文件/文件夹中文件名为 "type" 的项
  }

  return node
}

function convertTree(rootNode, parentPath) {
  const currentPath = parentPath ? `${parentPath}/${rootNode.name}` : rootNode.name

  if (rootNode.type === 'file') {
    return {
      value: rootNode.fullPath,
      label: rootNode.name,
    }
  }
  const children = rootNode.children.flatMap(child => convertTree(child, currentPath))

  // 如果当前节点没有子节点，并且不是 .ts 文件，返回一个 disabled 属性为 true 的对象
  if (children.length === 0 && !rootNode.name.endsWith('.ts')) {
    return [
      {
        value: rootNode.fullPath,
        label: rootNode.name,
        disabled: true,
      },
    ]
  }

  return [
    {
      value: rootNode.fullPath,
      label: rootNode.name,
      children,
      // selectable: false
    },
  ]
}

function getTreeData(projectPath) {
    const rootPath = path.join(projectPath, '/src/apis') //根目录路径
    const root = getFileInfo(rootPath, '')
    const treeData = convertTree(root)
    return treeData 
}

module.exports = {
  config,
  // generateImports,
  // buttonsHtml,
  // generateTableColumns,
  // generateTableColumnsNum,
  mkdir,
  getTreeData,
  creatPage,
}
