#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');

const currentPath = __dirname; // 当前路径
const parentPath = path.join(currentPath, '..'); // 上一层路径 
execSync(`npm run dev`, { stdio: 'inherit', cwd: parentPath });
