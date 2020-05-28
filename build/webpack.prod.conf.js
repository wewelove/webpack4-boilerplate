const Webpack = require('webpack');
const merge = require('webpack-merge');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 基本配置
const base = require('./webpack.base.conf');
// mode
const env = 'production';

module.exports = merge(base, {
    mode: env,
    module: {},
    plugins: [
        // 清理 dist 文件夹, 忽略 favicon.* 文件
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!favicon.*', '!.gitignore'],
        }),
        new Webpack.DefinePlugin({
            'process.env': env,
        })
    ]
});