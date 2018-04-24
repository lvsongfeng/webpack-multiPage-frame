const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path')
module.exports = {
  output:{
    path: path.join(__dirname,'vendor'),
    filename: '[name].js',
    library: '[name]'
  },
  entry :{
    // 指定需要打包的文件 css/less 字体文件 图片文件资源
    dll: [
      'jquery',
      'lodash'
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json', // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
      name: '[name]',  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
      context: __dirname, // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
    }),
    new ExtractTextPlugin('[name].css'), // 打包css/less的时候会用到ExtractTextPlugin
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      }
    }),
  ]
}