const path = require('path') //读取文件  
const CopyWebpackPlugin = require('copy-webpack-plugin') //拷贝

module.exports = {
	configureWebpack: {
		plugins: [
			new CopyWebpackPlugin([{
				from: path.join(__dirname, '/static/images'), //从哪里来   
				to: path.join(__dirname + '/unpackage/', 'dist', process.env.NODE_ENV === 'production' ?
					'build' : 'dev', process.env.UNI_PLATFORM, '/pages/') //到哪里去
			}])
		]
	}
}
