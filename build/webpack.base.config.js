const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const glob = require('glob');
let configPlugin = [];  //plugin 设置数组
configPlugin = [
    // new HtmlWebpackPlugin({//简化了html文件的创建，以便为webpack包提供服务。
    //     filename:resolve('/dist/index.html'),//处理dirname路径的问题 ，这里等同于'../dist/index.html'
    //     template:'./src/template/index.html',
    //     chunks:['common','index']//选择加载的css和js,模块名对应上面entry接口的名称
    // }),
    // new HtmlWebpackPlugin({
    //     filename:resolve('/dist/about.html'),
    //     template:'./src/template/about.html',
    //     chunks:['common','about']
    // }),
    // new HtmlWebpackPlugin({
    //     filename:resolve('/dist/contact.html'),
    //     template:'./src/template/contact.html',
    //     chunks:['common','contact']
    // }),
    new ExtractTextPlugin({//从bundle中提取出
        filename:(getPath)=>{
            return getPath('css/[name].[chunkhash].min.css').replace('css/js', 'css');//.js文件中的.css|.less|.sass内容转换成转换成.css文件。 2017-08-09,添加hash，有利于资源管理
        },
        disable:false,//禁用插件为false
        // allChunks:true
    }),
    //new ExtractTextPlugin('css/[name].css')
]

// node:{
//         __dirname:true//“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
//     }
function resolve(dir){//因为自己改变了文件的路径，这里需要重新处理一下
    return path.join(__dirname,'..',dir);
}
// 页面入口处理方法,遍历 js 文件夹面的js文件, 顺便插入模板文件 htmlWebpackPlugin
function pageEnteries () {
    var enter = {};
    var filePath = path.join(__dirname,'..','src/js');
    var options = {
        cwd: filePath, // 在src/js目录里找
        sync: true, // 这里不能异步，只能同步
    }
    var filePathAry = new glob.Glob('*.js', options); // ["about.js","contact.js","index.js"]
    filePathAry = filePathAry.found;
    filePathAry.forEach(element => {
        // 设置enter js 文件
        var key = element.split('.')[0]
        enter[key] =  path.resolve('./src/js/',element)
        // 设置 生成html 模板文件
         configPlugin.push(new HtmlWebpackPlugin({
            filename: resolve(`/dist/${key}.html`),//处理dirname路径的问题 ，这里等同于'../dist/index.html', 
            template: `./src/template/${key}.html`,
            chunks:['common',key]
            //template: './src/template/about.html',
          }))
    });
    var a = JSON.stringify(enter)
    console.log('hi'+ a)
    return enter
}

module.exports = {
    entry: pageEnteries(),
    output:{//指示webpack如何去输出，以及在哪里输出你的「bundle、asset和其他你所打包或使用webpack载入的任何内容」。
        path:path.join(__dirname,'../dist/'),//目录对应一个绝对路径
        //pathinfo:true,//告诉 webpack 在 bundle 中引入「所包含模块信息」的相关注释。默认是false，pathinfo是在开发环境中使用，在生产环境中就不推荐
        filename:'js/[name].[chunkhash].min.js',//filename选项决定了在每个输出bundle的名称。这些bundle将写入到「output.path」选项指定的目录下。2017-08-09版本叠加，添加hash，有利于管理
        //publicPath:'/',//值是string类型，对于加载（on-demand-load）或加载外部资源(external resources)（如图片、文件等）来说
        //output.publicPath是很重要的选项。如果指定了一个错误的值，则在加载这些资源的时候会收到404错误
    },
    module:{ //处理项目中的不同的模块
        rules:[//格式array,创建模块时，匹配请求的规则数组。这些规则能够对修改模块的创建方式。这些规则能够对（module）应用loader，或修改解析器（parser）
            {//本json是对js的eslint的检查
                enforce:"pre",//在babel-loader对源码进行编译前进行lint的检查
                test:/\.(js|html)$/,//检查js文件和html文件内的javascript代码的规范
                exclude:path.join(__dirname,'node_module'),
                use:[{
                    loader:"eslint-loader",
                    options:{
                        formatter: require('eslint-friendly-formatter')   // 编译后错误报告格式
                    }
                }]
            },
            {// 处理js-es6的规则
                test:/\.js$/,//匹配资源，处理的文件的后缀名
                exclude:path.join(__dirname,'node_modules'),//排除匹配的文件夹
                use:{//每个入口（entry）指定使用一个loader，处理的加载器是loader
                    loader:'babel-loader',
                    query:{
                        presets: ["es2015"]
                    }
                },
                include:path.join(__dirname,'src'),//包含的路径（匹配特定条件）
            },
            {
                test:/\.css$/,
                use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:['css-loader','autoprefixer-loader'],
                    publicPath: "../"//生产环境下（也就是npm run build之后）重写资源的引入的路径,参考链接https://webpack.js.org/plugins/extract-text-webpack-plugin/#-extract
                })
            },
            {//处理css的规则,处理less的规则
                test:/\.less$/,
                use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:['css-loader','autoprefixer-loader','less-loader'],
                    publicPath: "../"
                })
            },
            {//处理图片资源,样式
                test:/\.(png|svg|jpg|jpeg|gif)$/,//这里处理了以.png .svg .jpg .jpeg .gif为后缀名的图片
                use:[
                    {loader:'file-loader?limit=1024&name=images/[name].[ext]'}//加载器file-loader和npm run build之后 图片的存储文件夹
                ]
            },
            {//处理html，插入在html中的图片img用此处理
                test:/\.html$/,
                use:[
                    {loader:'html-loader'}
                ]
            },
            {//处理字体
                test:/\.(woff|woff2|eot|ttf|otf)$/,
                use:[
                    // 'file-loader'//等同于{loader:'file-loader'}
                    {loader:'file-loader?limit=1024&name=fonts/[name].[ext]'}//加载器file-loader和npm run build之后字体的存储文件夹
                ]
            },
            {//处理handlebar
                test:/\.handlebars$/,
                use:[
                    {loader:"handlebars-loader"}
                ]
            }
        ]
    },
    node:{
        fs:"empty"
    },
    plugins: configPlugin
}
