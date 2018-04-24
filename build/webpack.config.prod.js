
const baseWebpackConfig = require('./webpack.base.config.js')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const os = require('os')
module.exports = merge(baseWebpackConfig, {
    plugins: [
        //插件，具体的内容可以查看链接 -- https://doc.webpack-china.org/plugins/
        new OptimizeCssAssetsPlugin({
            //对生产环境的css进行压缩
            cssProcessorOptions: {
                safe: true
            }
        }),
        new CleanWebpackPlugin(['dist']),
        
        new UglifyJsParallelPlugin({
            workers: os.cpus().length,
            mangle: true,
            exclude: /\.min\.js$/,
            output: { comments: false },
            compressor: {
                warnings: false,
                drop_console: true,
                drop_debugger: true
            }
        }),

        // new webpack.DllReferencePlugin({
        //     context: __dirname, 
        //     manifest: require('../manifest.json')
        // }),

        // new HtmlWebpackIncludeAssetsPlugin({
        //     assets: ['dist/js/vendor.dll.js'],
        //     files: ['*.html'],
        //     append: false,
        //     hash: true
        // })
    ]
})