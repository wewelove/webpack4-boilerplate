const Webpack = require('webpack');
const merge = require('webpack-merge');

const base = require('./webpack.base.conf');

const env = 'development';

module.exports = merge(base, {
    mode: env,
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        inline: true,
        clientLogLevel: 'warning',
        open: true,
        contentBase: ['./dist', './src'],
        compress: true,
        disableHostCheck: true,
        host: "0.0.0.0",
        port: 1024,
        useLocalIp: true,
        hot: true,  // 开启模块热更新功能
        watchContentBase: true,
        watchOptions: {
            poll: true
        },
        overlay: {
            warnings: false,
            errors: true
        },
    },
    module: {},
    plugins: [
        new Webpack.DefinePlugin({
            'process.env': env,
        }),
        // 支持模块热更新功能
        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.NamedModulesPlugin()
    ]
});