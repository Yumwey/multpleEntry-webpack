/*
 * @Author: Yumwey
 * @Date:   2016-11-25 13:16:41
 * @Last Modified by:   Yumwey
 * @Last Modified time: 2016-11-26 16:18:07
 */
//生产环境配置文件
'use strict';

const devConfig = require('./webpack.config.js');

module.exports = devConfig({dev:false});