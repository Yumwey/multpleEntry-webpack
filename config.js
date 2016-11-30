//设置全站变量
var path = require('path');
var config = {
    //配置sourceMap
    devTool:{
        EVA:'eval-source-map',
        CHEAP_E:'cheap-module-eval-source-map',
        PRO:'source-map'
    },
    sourceUrl:{
        dir_entry:'dev',
        dir_dist:path.join(__dirname,'/dist')
    }
}

module.exports = config;