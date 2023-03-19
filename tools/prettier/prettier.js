/**
 * copy to https://github.com/facebook/react/blob/master/scripts/prettier/index.js
 * prettier api doc https://prettier.io/docs/en/api.html
 *----------*****--------------
 *  prettier all js and all ts.
 *----------*****--------------
 */

const glob = require('glob')
const { prettierFiles } = require('./utils')
const pack = require('../../package.json');

const ignoreFiles = pack['lint-staged'].ignore;

let files = []

const jsFiles = glob.sync('**/*.js*', {
	ignore: ignoreFiles,
})
const tsFiles = glob.sync('**/*.ts*', {
	ignore: ignoreFiles,
})
const vueFiles = glob.sync('**/*.vue', {
	ignore: ignoreFiles,
})
const lessFiles = glob.sync('**/*.less', {
	ignore: ignoreFiles,
})
files = files.concat(jsFiles)
files = files.concat(tsFiles)
files = files.concat(vueFiles)
files = files.concat(lessFiles)

if (!files.length) {
	return
}
prettierFiles(files)
