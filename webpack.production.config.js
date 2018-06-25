/*
 * @file webpack配置文件(产品环境)
 * @author liutianjiao
 * @date 2017-09-05
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        bundle: './app/router.jsx',
        vendor: ['react', 'react-dom', 'jquery', 'react-router', 'redux']
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].[hash:5].js',
        chunkFilename: "js/[name].chunk.js" //给每个分片产生一个文件
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
            },
            {
                test: /\.less|css$/,
                use: [{
                    loader:'style-loader'
                },
                    {
                        loader:'css-loader?#sourceMap'
                    },
                    {
                        loader:'postcss-loader'
                    },
                    {
                        loader:'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ],
            },
            {
                test: /\.eot|woff|eot|ttf|svg$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor']
        }),
        new HtmlWebpackPlugin({
            //根据模板插入css/js等生成最终HTML
            title: 'CDM机场协同放行',//根据模板插入css/js等生成最终HTML
            filename:'index.html',    //生成的html存放路径，相对于 path
            // template:'./app/index.html',    //html模板路径
            favicon: './app/favicon.ico',
            inject:true,    //允许插件修改哪些内容，包括head与body
            // hash:true,    //为静态资源生成hash值
            minify:{    //压缩HTML文件
                removeComments:true,    //移除HTML中的注释
                collapseWhitespace:false    //删除空白符与换行符
            }
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'initial',
                    minChunks: 2
                }
            }
        }
    }
}
