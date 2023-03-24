#!/usr/bin/env node

const path = require('path')
const { spawn } = require('child_process')

const currentPath = __dirname // 当前路径
const parentPath = path.join(currentPath, '..') // 上一层路径

async function commond() {
  const devProcess = spawn('npm', ['run', 'dev'], { stdio: 'inherit', cwd: parentPath })
  const toolProcess = spawn('npm', ['run', 'tool'], { stdio: 'inherit', cwd: parentPath })

  await Promise.all([
    new Promise(resolve => devProcess.on('exit', resolve)),
    new Promise(resolve => toolProcess.on('exit', resolve)),
  ])
}

commond()
