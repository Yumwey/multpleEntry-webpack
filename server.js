//选型使用的是Express,并没有使用koa,因为没学过. 😀

var PORT = process.env.PORT || 8024;;

var http = require('http');
var url = require('url');
var fs = require('fs');
var mine = require('./mine').types;
var path = require('path');
var connect = require('connect');
var sassMiddleware = require('node-sass-middleware');
var serveStatic = require('serve-static');

var webpack_dev = require('./webpack.config.js');

console.log(webpack_dev);
var app = connect();

//插入中间件:node-sass编译中间件
var cssPath = path.join(__dirname, 'css');
var sassPath = path.join(__dirname, 'sass/modules');
app.use('/css', sassMiddleware({
    src: sassPath,
    dest: cssPath,
    debug: true,
    outputStyle: 'expanded'
}))
app.use('./', serveStatic('./css', {}));
//处理文件响应请求
app.use(function(request, response) {
    //请求文件路径
    var pathname = url.parse(request.url).pathname;
    //文件对应真实路径
    var realpath = path.join('./', pathname);
    var etc = path.extname(realpath);
    etc = etc ? etc.slice(1) : 'unknown';

    //判断是否存在,文件错误处理
    fs.exists(realpath, function(exists) {
        console.log(realpath);
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("请求的路劲： " + pathname + " 可能不存在！");
            response.end();
        } else {
            fs.readFile(realpath, "binary", function(err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.write(err + '');
                    response.end();
                } else {
                    var contentType = mine[etc] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    })
})
var server = http.createServer(app).listen(PORT);
console.log("服务运行中: 端口" + PORT + "，默认：http://127.0.0.1/.");