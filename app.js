const Koa = require('koa');
const convert = require('koa-convert');
const static = require('koa-static');
const logger = require('koa-logger');
const path = require('path');
const fs = require('fs');
const {webpackDev, webpackHot} = require('./clientDevMiddleware');

const app = new Koa();

app.use(convert(logger()));
// 静态文件设置
app.use(static(path.join(__dirname, 'build/static')));

app.use(webpackDev);
app.use(webpackHot);



app.use(async (ctx, next) => {
    ctx.type = 'text/html';
    ctx.body = fs.createReadStream(path.join(__dirname, 'index.html'));
    
    next();
})








module.exports = app;