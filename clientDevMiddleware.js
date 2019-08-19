const webpack = require('webpack');
const webpackConfig = require('./compile/webpack.dev');
const compile = webpack(webpackConfig);

const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const webpackdevMiddleware = require('koa-webpack-dev-middleware');





const webpackDev = webpackdevMiddleware(compile, {
    lazy: false,
    watchDelay: 300,
    noInfo: true,
    stats: {
        colors: true
    },
    publicPath:webpackConfig.output.publicPath
})



const webpackHot = webpackHotMiddleware(compile);


module.exports = {
    webpackDev,webpackHot
}