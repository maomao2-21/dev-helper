const fs = require('fs')
const path = require('path')

const regexArray = [
  { regex: /data\s*\?\s*:\s*(\w+)/, name: 'Req' },
  { regex: /export\s+function\s+(\w+)\s*\(/, name: 'Function' },
  { regex: /List/, name: 'Res' },
]

const parseAPI = fileContent => {
  const obj = {}
  const extraImport = []
  const reserveType = {}
  const currentType = {}

  regexArray.forEach(({ regex, name }) => {
    const matchResult = fileContent.match(regex)

    if (matchResult) {
      const Data = matchResult[1] || matchResult[0]
      obj[name] = Data
      const importStatements = fileContent.match(/import.*?from\s+['"](.+?)['"]/g) || []
      for (const statement of importStatements) {
        if (statement.includes(Data)) {
          extraImport.push(statement)
          reserveType[name] = Data
        }
      }
    } else {
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

const getAPImsg = parameters => {
  try {
    const { apiPath,projectPath } = parameters
    const currentDir = path.resolve(projectPath)
    const filename = path.join(currentDir, `/${apiPath}`)
    const fileContent = fs.readFileSync(filename, 'utf-8')

    const { obj, extraImport, currentType } = parseAPI(fileContent)
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
