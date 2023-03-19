const readline = require('readline')
const { config, mkdir, creatPage } = require('./common.js')
// const { getAPImsg } = require('./create-net')
// const template = require('./creat_template')
const fs = require('fs')
const path = require('path')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askNext(dialogues, params) {
  try {
    const dialogue = dialogues.shift() // 取出下一个对话
    if (dialogue) {
      rl.question(dialogue.question, answer => {
        dialogue.handler(answer.trim(), params) // 处理用户的回答，并传递参数给下一个对话
      })
    } else {
      // 所有对话都处理完毕，关闭 readline
      rl.close()
      if (params) {
        creatPage(params)
      } else {
        console.log('请选择列表模版')
      }
    }
  } catch (e) {
    console.log('对话解析异常')
    console.log(e)
  }
}

// 实际的对话数组
const questions = []
// 所有的对话数组
const questionsAllObj = {
  apiPath: {
    title: 'apiPath',
    question: '请输入net文件的绝对路径 如`src/apis/ofc/api/fulfillment/detailQNet.ts` :',
    handler: (answer, params) => {
      const nextParams = { apiPath: answer, ...params }
      askNext(questions, nextParams) // 处理完当前对话后，将剩余对话和参数继续传递给 askNext 函数
    },
  },
  buttons: {
    title: 'buttons',
    question: '请输入你需要的按钮 如 `新增,导出` :',
    handler: (answer, params) => {
      let buttons = []
      if (answer) {
        let replacedStr = answer.replace(/，/g, ',')
        buttons = replacedStr.split(',')
      }
      const nextParams = { buttons, ...params }
      askNext(questions, nextParams) // 处理完当前对话后，将剩余对话和参数继续传递给 askNext 函数
    },
  },
  columns: {
    title: 'columns',
    question: '请输入你的columns 如`标题1,标题2,操作` :',
    handler: (answer, params) => {
      let columns = []
      if (answer) {
        let replacedStr = answer.replace(/，/g, ',')
        columns = replacedStr.split(',')
      }
      const nextParams = { columns, ...params }
      askNext([], nextParams) // 所有对话处理完毕后直接结束
    },
  },
}
const dialoguesBase = [
  {
    question: '请选择要生成的模板类型（list_one/list_two）：',
    handler: answer => {
      const type = config[answer] || config[`list_${answer}`]
      if (type) {
        const { data } = type
        data.forEach(_ => {
          questions.push(questionsAllObj[_])
        })
        askNext(questions, { listType: type.templateName }) // 执行 questions 对话数组，并将 null 作为参数传递
      } else {
        askNext([], null) // 其他类型的对话，直接结束
      }
    },
  },
]

// function creatPage(params) {
//   console.log(params)
//   getAPImsg(params)
//   const templet = template[params.listType](params)
//   if (params.outPath) {
//     mkdir(params.outPath, templet)
//   } else {
//     const outputFilePath = path.join(__dirname, config[params.listType].name)

//     fs.writeFileSync(outputFilePath, templet)
//   }

//   console.log('list.vue生成')
// }

askNext(dialoguesBase)
