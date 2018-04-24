const baseWebpackConfig = require('./webpack.base.config.js');

const path = require('path');
const webpack = require('webpack');
const merge = require("webpack-merge");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = merge(baseWebpackConfig,{
    plugins:[//插件，具体的内容可以查看链接 -- https://doc.webpack-china.org/plugins/
        new OptimizeCssAssetsPlugin({   //对生产环境的css进行压缩
            cssProcessorOptions:{
                safe:true
            }
        }),
        new CleanWebpackPlugin(['dist'])
    ],
})
