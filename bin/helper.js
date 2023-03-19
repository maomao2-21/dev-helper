#!/usr/bin/env node

const { execSync } = require('child_process');

execSync('npm run dev', { stdio: 'inherit' });
