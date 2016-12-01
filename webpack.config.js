// 开发环境配置文件

var webpack = require('webpack');
var glob = require('glob');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-plugin-notifier');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var DefinePlugin = webpack.DefinePlugin;
var config = require('./config.js');

//路径 
var node_module_dir = path.join(__dirname, 'node_modules');

var deps = [
    //依赖的lib，用于noparse属性：不解析的插件类
    path.join(__dirname,'/js/lib/jquery-1.10.0.min.js')
]

//返回匹配规则中的文件名称 {Array<String>}
var files = glob.sync(path.join(__dirname,'/dev/*/main.js'));
var otherEntries = {};
console.log(files);
files.forEach(function(f){
     //查找每个功能目录入口文件及对应绝对路径
    var fn = /.*(\/.*?\/main)\.js/.exec(f)[1];  //匹配 [name]/main.js
    otherEntries[fn] = f;
})
//可以设置其他可定制entry入口
var specifyEntries = {};
var configs = {
    //使用sourceMap
    devtool:config.devTool.EVA,
    //输入路径
    entry:Object.assign({},specifyEntries,otherEntries),
    //输出路径
    output:{
        path:config.sourceUrl.dir_dist,
        filename:'[name].js',
        publicPath:'../../dist'   //静态资源发布路径，处理资源访问
    },
    resolve:{
        //定义模块搜索路径
        root:[process.cwd()+'/dev',process.cwd()+'/node_modules'],
        //定义后缀补全
        extensions: ['', '.js', '.css','.png', '.jpg','jsx'],
        //定义模块别名：使用插件的时候可以省略完整路径->Replace modules with other modules or paths.
        alias:{
            jQuery:deps[0]
        }
    },
    //引用外部依赖，但是使用得在页面中引入地址，原因就是处理JQ插件依赖包的无法读取$问题，如果是npm导入，则不需要
    externals:{
        jQuery:'window.$'
    },
    module:{
        //对于无依赖的大文件使用noparse,不解析文件，提高性能用的
        noparse:deps,
        loaders:[
           {
               //css单独处理，不打包进main.js文件
               test: /\.css$/,
               loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
               //json文件读取 
  			    test:/\.json$/,
                loader:'json'
            },
            {
                //针对jsx语法和ES6，使用babel
                test:/\.jsx?$/,
                exclude:/node_modules/,
                loader:'babel'
            },
            {   //url-loader依赖于file-loader
                test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
                loader: 'url-loader?limit=8000&name=images/[hash:8].[name].[ext]'
            }
        ]
    },
     plugins:[
         //压缩文件
        new UglifyJsPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.CommonsChunkPlugin('vendor')
        //new WebpackNotifierPlugin()
         new ExtractTextPlugin('[name].css'),
         //new DashboardPlugin()
        // new ExtractTextPlugin('stylesheets/[name].less')
    ],
    devServer: {
            // hot: true,
            noInfo: false,
            inline: true,
            publicPath: path.join(process.cwd(),'/dist'),
            stats: {
                cached: false,
                colors: true
            }
        }
}

module.exports = configs;