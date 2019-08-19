const webpack = require('webpack');
const path = require('path');
const SRC_PATH = path.resolve(__dirname, '../', 'src');
const DIST_PATH = path.resolve(__dirname, '../', 'build/static');
const NODE_MODULES = path.resolve(__dirname, '../', 'node_modules');


//插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AutoDllPlugin = require('autodll-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

//复制index.html 模板配置数据
let HtmlPluginOptions = {
    filename: path.resolve(__dirname, '../', 'index.html'),
    chunks: ['main','vendor'],
    template: SRC_PATH + '/tpl.html',
    // favicon: './src/img/favicon.ico',
    // inject: true
};


let options = {
    entry: SRC_PATH + "/routers.js",
    output: {
        filename: 'js/[name]-[hash:8].js',
        path: DIST_PATH,
        publicPath: '/',
        chunkFilename: 'js/[name]-[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: NODE_MODULES,
                include: SRC_PATH,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['es2015', 'react', 'stage-1'],
                        plugins: [
                            "syntax-dynamic-import",
                            ["import",{
                                "libraryName": "antd",
                                "libraryDirectory": "es",
                                "style": "css" // `style: true` 会加载 less 文件
                            }]
                        ]
                    }
                }
            },
            // {
            //     test: /\.js$/,
            //     loader: 'eslint-loader',
            //     enforce: "pre",
            //     include: [SRC_PATH], // 指定检查的目录
            //     options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
            //         formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
            //     }
            // },
            {//antd样式处理
                test:/\.css$/,
                use:[
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options:{
                            importLoaders:1
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: ['style-loader', MiniCssExtractPlugin.loader , "css-loader", {
                    loader: "postcss-loader",
                    options: {
                        plugins: [
                            require('autoprefixer')
                        ]
                    }
                },{
                    loader:'less-loader',
                    options:{
                        javascriptEnabled: true
                    }
                }]
            },
            {
                test: /\.(png|jpg|jpge|gif|svg)$/,
                exclude: [SRC_PATH + '/img/svg'],
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 50000,
                        outputPath: './',
                        name: '[name].[ext]'
                    }
                }]
            },
            {
                test: /\.svg$/, //处理svg
                loader: 'svg-sprite-loader',
                include: [SRC_PATH + '/img/svg']
            }
        ]
    },
    mode:'production',
    plugins: [
        new webpack.DefinePlugin({ //关闭antd warning
            "process.env.NODE_ENV": JSON.stringify('production')
        }),
        new HtmlWebpackPlugin(HtmlPluginOptions),
        new AutoDllPlugin ({
            inject:true,
            debug: true,
            filename:'commonThunk-[hash:8].js',
            path:'js',
            plugins:[
                new webpack.DefinePlugin({
                    "process.env.NODE_ENV": JSON.stringify('production')
                }),
                new ParallelUglifyPlugin({
                    uglifyJS:{
                        output: {
                            comments: false
                        },
                        warnings: false
                    }
                })
            ],
            entry:{
                vendor:[
                    'react',
                    'react-dom',
                    'react-router',
                    'redux',
                    'react-redux',
                    'redux-thunk'
                ]
            }
        }),
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom',
            Component: ['react', 'Component'],
            browserHistory: ['react-router', 'browserHistory'],
            Link: ['react-router', 'Link'],
            PropTypes: ['prop-types'],
            utils: ['../../utils/utils']
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]-[hash:8].css',
            chunkFilename: 'css/[name]-[hash:8].css',
        }),
        new ParallelUglifyPlugin({
            uglifyJS:{
                output:{comments:false},
                warnings: false
            }
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '-',
            cacheGroups: {
                vendor: {
                    chunks:"initial",
                    name:"vendor",
                    enforce: true
                }
            }
        },
        minimizer:[new OptimizeCSSAssetsPlugin({})]
    }
}


module.exports = options;