var fs = require("fs");
const path = require('path');
const copy = require('copy');
const remove = require('remove');
const jsonfile = require('jsonfile');

// 入口配置
const entry = require('./entry.json');
// html webpack plugin 插件配置
const pages = require('./pages.json');

// 全局变量
const pagesPath = path.resolve(__dirname, '../src/pages'); // 页面目录
const entryFile = path.resolve(__dirname, 'entry.json'); // 入口配置文件
const pagesFile = path.resolve(__dirname, 'pages.json'); // html webpack plugin 插件配置文件

// 获取输入参数
const argv = process.argv;

// 新建页面
if (argv[2] == 'new') {
    // 参数不足直接退出
    if (argv.length < 5) {
        console.warn('请输入页面名称和标题!');
        console.warn('npm run new <name> <title> [<template>]');
        process.exit();
    }

    // 模板目录
    let name = argv[3];
    let title = argv[4];
    let template = argv[5] || 'template';
    let from = path.resolve(pagesPath, template);
    let to = path.resolve(pagesPath, name);

    // 模板不存在直接退出
    if (!fs.existsSync(from)) {
        console.warn(template + ': 模板不存在!');
        process.exit();
    }

    // 页面存在直接退出
    if (fs.existsSync(to)) {
        console.warn(name + ': 页面已经存在!');
        process.exit();
    }

    // 从模板复制新页面
    copy(from + '/**/*', to, function (err) {
        // 错误提示
        if (err) {
            console.log(name + ': 页面创建失败!');
            process.exit();
        }

        // 更新入口配置
        entry[name] = './src/pages/' + name + '/script.js';
        jsonfile.writeFileSync(entryFile, entry, {
            spaces: 2,
            EOL: '\r\n'
        }, function (err) {
            if (err) throw err;
        });
        
        // 更新 html webpack plugin 插件配置
        pages.push({
            "title": title,
            "filename": name + '.html',
            "template": "./src/pages/" + name + '/layout.ejs',
            "chunks": [name, "common", "vendor", "manifest"],
            "inject": true,
            "minify": {
                "collapseWhitespace": false,
                "removeComments": false,
                "collapseBooleanAttributes": true,
                "removeRedundantAttributes": true,
                "removeScriptTypeAttributes": true,
                "removeStyleLinkTypeAttributes": true,
                "useShortDoctype": true
            }
        });
        jsonfile.writeFileSync(pagesFile, pages, {
            spaces: 2,
            EOL: '\r\n'
        }, function (err) {
            if (err) throw err;
        });

        console.log(name + ': 页面创建成功!');
        process.exit();
    });
}

// 删除页面
if (argv[2] == 'del') {
    // 参数不足直接退出
    if (argv.length < 4) {
        console.warn('请输入页面名称!');
        console.warn('npm run rm <name>');
        process.exit();
    }

    // 获取页面目录
    let name = argv[3];
    let filename = name + '.html';
    let page = path.resolve(pagesPath, name);

    // 默认模板页面不允许删除
    if (name === 'template') {
        console.log(name + ': 默认模板页面不允许删除!');
        process.exit();
    }

    // 删除页面
    remove(page, function (err) {
        // 错误提示
        if (err) {
            console.log(name + ': 页面不存在!');
            process.exit();
        }

        // 更新入口配置
        delete entry[name];
        jsonfile.writeFileSync(entryFile, entry, {
            spaces: 2,
            EOL: '\r\n'
        }, function (err) {
            if (err) throw err;
        });

        // 更新 html webpack plugin 插件配置
        pages.map(function (obj, i) {
            if (obj.filename == filename) pages.splice(i, 1);
        });
        jsonfile.writeFileSync(pagesFile, pages, {
            spaces: 2,
            EOL: '\r\n'
        }, function (err) {
            if (err) throw err;
        });

        console.log(name + ': 页面已经删除!');
        process.exit();
    });
}