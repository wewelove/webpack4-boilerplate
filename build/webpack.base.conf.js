const path = require("path");
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// 入口配置
const entry = require('./entry.json');
// html webpack plugin 插件配置
const pages = require('./pages.json');

// 目录
const src = path.resolve(__dirname, '../src');
const dist = path.resolve(__dirname, '../dist');

module.exports = {
    entry: entry,
    output: {
        path: dist,
        publicPath: '/',
        filename: 'js/[name].[hash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.(html)$/i,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: false,
                            esModule: false
                        }
                    }
                ]
            },
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            },
            {
                test: /\.(sass|scss|css)$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true,
                        },
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                        limit: 1024, // 1k
                        name: '[name].[hash:8].[ext]', // 输出文件名
                        outputPath: 'imgs/' // 输出目录, 相对 dist
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]', // 输出文件名
                        outputPath: 'fonts/' // 输出目录, 相对 dist
                    }
                }]
            }
        ]
    },
    plugins: [
        // 自动加载模块
		new Webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
		}),
        // 生成 html webpack plugin 插件配置
        ...pages.map(page => new HtmlWebpackPlugin(page)),
        // 提取 css 文件
        new MiniCssExtractPlugin({
            filename: `css/[name].[hash:8].css`,
            chunkFilename: `css/[name].[hash:8].css`,
        }),
        // css 压缩
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/i,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: [
                    'default',
                    {
                        discardComments: {
                            removeAll: true,
                        },
                        normalizeUnicode: false
                    }
                ]
            },
            canPrint: false
        })
    ],
    optimization: {
        // 提取运行时 Chunk
        runtimeChunk: {
            name: "manifest"
        },
        // 提取公共代码 Chunk
        splitChunks: {
            cacheGroups: {
                common: {
                    name: "common",
                    chunks: "initial",
                    minChunks: 2,
                    enforce: true
                },
                vendor: {
                    name: 'vendor',
                    test: /node_modules/,
                    chunks: 'all',
                },
            }
        }
    },
    resolve: {
        alias: {
            // 指定目录别名
            '@': src
        },
        extensions: ['.js', '.json', '.scss']
    }
}