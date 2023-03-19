/**
 *----------*****--------------
 *  pre commit prettier file
 * 格式化提交的文件
 *----------*****--------------
 */
const { prettierFiles } = require('./utils')

let files = process.argv.slice(2)

// files = files.filter(file => {
// 	const reg = new RegExp('re_enum|src/api/(net|java)/');
// 	return !reg.test(file);
// });
if (!files.length) {
	return
}
prettierFiles(files)
