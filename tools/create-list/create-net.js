const fs = require('fs')
const path = require('path')

const regexArray = [
  { regex: /data\s*\?\s*:\s*(\w+)/, name: 'Req' },
  { regex: /export\s+function\s+(\w+)\s*\(/, name: 'Function' },
  { regex: /\bList\b/, name: 'Res' },
  { regex: /Promise\s*<\s*(.+)\s*>/, name: 'importRes' },
]

const parseAPI = (fileContent, currentDir) => {
  const obj = {}
  let extraImport = []
  const reserveType = {}
  /** import {a,b} 这种导入方式 */
  const currentType = {}
  let regexs = [...regexArray]
  console.log(regexs.length)
  regexs.forEach(({ regex, name }) => {
    const matchResult = fileContent.match(regex)

    if (matchResult) {
      const Data = matchResult[1] || matchResult[0]
      obj[name] = Data
      const importStatements = fileContent.match(/import.*?from\s+['"](.+?)['"]/g) || []
      for (const statement of importStatements) {
        if (statement.includes(Data)) {
          //不需要传递模型的返回 只需要模型的list
          if (name !== 'importRes') {
            extraImport.push(statement)
          }
          reserveType[name] = Data
          if (name === 'importRes') {
            getimportRes(statement, currentDir, extraImport, obj)
          }
        }
        //如果List 没有 也就是List在别的文件中
      }
      extraImport = [...new Set(extraImport)]
      if (name === 'Res') {
        regexs.pop()
      }
    } else {
      obj[name] = undefined
      console.log(`未找到匹配结果${name}`)
    }
  })

  for (let [prop, value] of Object.entries(obj)) {
    if (!reserveType[prop]) {
      currentType[prop] = value
    }
  }

  return { obj, extraImport, currentType }
}
const getimportRes = (allContent, currentDir, extraImport, obj) => {
  const regExp = /import\s*{\s*.+?\s*}\s*from\s*'([^']+)'/
  const match = allContent.match(regExp)
  if (match) {
    const result = match[1].replace('@', 'src') // 替换 @ 符号
    let filename = path.join(currentDir, `/${result}.ts`)
    let nextContent = fs.readFileSync(filename, 'utf-8')
    const data = nextContent.match(/list\s*\?\s*:\s*(\w+)\[]/)
    if (data) {
      let name = data[1] || data[0]
      const importStatements = nextContent.match(/import.*?from\s+['"](.+?)['"]/g)
      for (const statement of importStatements) {
        if (statement.includes(name) && name) {
          extraImport.push(statement)
          obj.importRes = name
        }
      }
    }
  }
}

const getAPImsg = parameters => {
  try {
    const { apiPath, projectPath } = parameters
    const currentDir = path.resolve(projectPath)
    const filename = path.join(currentDir, `/${apiPath}`)
    const fileContent = fs.readFileSync(filename, 'utf-8')

    // const fileContent = fs.readFileSync(filename, 'utf-8')
    const { obj, extraImport, currentType } = parseAPI(fileContent, currentDir)
    const filePath = apiPath.replace(/^src/, '@')

    parameters.Netall = {
      ...obj,
      extraImport,
      currentType,
      filePath,
    }
  } catch (e) {
    console.log('api接口解析异常：', parameters.apiPath)
    console.log(e)
  }
}

module.exports = {
  getAPImsg,
}
