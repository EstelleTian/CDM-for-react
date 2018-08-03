/*
 * @file webpack配置文件(开发环境)
 * @author liutianjiao
 * @date 2017-09-05
 */
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
//代码压缩用ParallelUglifyPlugin代替自带的 UglifyJsPlugin插件
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const port = 3033;

module.exports = {
    devtool: 'source-map',
    entry: {
        bundle: './src/app.jsx',
        vendor: ['react', 'react-dom', 'jquery', 'react-router', 'redux'],
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].[hash:5].js',
        chunkFilename: "js/[name].chunk.js" //给每个分片产生一个文件
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }]
            },
            {
                test: /\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader:'css-loader'
                        },
                        {
                            loader:'postcss-loader'
                        },
                        {
                            loader:'less-loader',
                            options: {
                                javascriptEnabled: true,
                                modifyVars:{
                                    "primary-color":"rgba(0, 0, 0, .7)",
                                    "heading-color": "#fff",
                                    "text-color": "#fff",
                                    "text-color-secondary": "#fff",
                                    "input-bg": "rgba(0, 0, 0, 0)",
                                    "layout-body-background": "rgba(0, 0, 0, 0)",
                                    "layout-header-background ": "rgba(0, 0, 0, 0)",
                                    "layout-sider-background-light": "rgba(0, 0, 0, 0)",
                                    "component-background": "rgba(0, 0, 0, 0)",
                                    "popover-bg": "#444444",
                                    "border-color-split ": "rgba(255,255,255,.125)",
                                }
                            }
                        }
                    ]

                }),
            },
            {
                test: /\.eot|woff|eot|ttf|svg$/,
                use: ['file-loader']
            },
            {
                test: /\.jpg|png$/,
                use: ['url-loader']
            }
        ]
    },
    resolve : {
        extensions: [".js", ".jsx", ".less", ".css", ".json"],
        alias:{
            utils: path.resolve(__dirname, 'src/utils'),
            components: path.resolve(__dirname, 'src/components'),
        }
    },
    plugins: [
        new OpenBrowserPlugin({
            url: `http://localhost:${port}`
        }),
        new HtmlWebpackPlugin({
            title: 'CDM机场协同放行',
            // filename:'index.html',    //生成的html存放路径，相对于 path
            // template:'./app/index.html',    //html模板路径
            // inject:true,    //允许插件修改哪些内容，包括head与body
            // hash:true,    //为静态资源生成hash值
            // minify:{    //压缩HTML文件
            //     removeComments:true,    //移除HTML中的注释
            //     collapseWhitespace:false    //删除空白符与换行符
            // }
        }),
        new BundleAnalyzerPlugin(), //代码分片
        new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            uglifyJS:{
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            }
        }),
        new ExtractTextPlugin({
            filename: 'css/[name][hash:8].css',
            allChunks: true
        }),
    ],
    devServer: {
        compress: false, // 启用gzip压缩
        contentBase: path.join(__dirname, 'src'),
        port: port, // 运行端口3000
        inline: true,
        hot: true,
        historyApiFallback: true,
    },
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
};
