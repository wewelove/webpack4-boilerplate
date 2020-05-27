
## 简介

Webpack4 + jQuery + Bootstrap4 技术栈实现多页面开发。

## 目标

- [X] 支持多入口，多页面
- [X] 支持 ES6 语法
- [X] 自动加载模块，如 jQuery
- [X] 支持图片压缩
- [X] 支持 css 文件抽取
- [X] 支持 common 抽取
- [X] 支持 vendor 抽取
- [X] 开发环境支持文件变化监听
- [X] 开发环境支持模块热替换
- [X] 命令行创建和删除页面


## 目录结构

```sh
<project> # 项目目录
|- build  # 配置文件目录
|  |- entry.json  # 入口配置
|  |- pages.json  # html webpack plugin 插件配置
|  |- tools.js  # 新建/删除页面功能
|  |- webpack.base.conf.js  # 基本配置
|  |- webpack.dev.conf.js  # 开发配置
|  |- webpack.prod.conf.js  # 生产配置
|- src # 源代码目录
|  |- fonts  # 公共字体文件目录
|  |- images  # 公共图片资源文件目录
|  |- pages  # 页面目录
|  |  |- template  # template 页面目录
|  |  |  |- images  # 页面图片目录
|  |  |  |- index.html # html 页面
|  |  |  |- index.js  # 入口文件
|  |  |  |- index.css  # 样式文件
|  |  |- index  # index 页面目录
|  |  |  |- images  # 页面图片目录
|  |  |  |- index.html
|  |  |  |- index.js
|  |  |  |- index.css
|  |  |- about  # about 页面目录
|  |  |  |- images  # 页面图片目录
|  |  |  |- index.html
|  |  |  |- index.js
|  |  |  |- index.css
|  |- scripts   # 公共脚本文件目录
|  |- styles    # 公共样式文件目录
|- .gitignore
|- package-lock.json
|- package.json
|- postcss.config.js # postcss 配置文件
|- README.md
```

## 配置文件

```js
// 基本结构
module.exports = {
    mode: '',           // 指定模式, production | development
    entry: {},          // 入口对象
    output: {},         // 输出
    devtool: {},        // 开发环境, 指定 source map 生成
    devServer: {},      // 开发环境, 启动本地服务
    module: {
        rules: []       // 指定 loader 规则
    },
    plugins: {},        // 插件
    optimization: {},   // 优化
    resolve: {},        // 解析
}
```

## 开始

```sh
# 克隆
git clone project

# 安装依赖
cd project & npn install

# 开发，开启本地服务
npm run dev

# 生产编译
npm run build

# 创建新页面
# name 页面名称(存放目录 ./src/pages/<name>)
# title 页面的 <title><title> 内容
# template 页面生成时使用的模板, 可以是已经存在的任意页面名称
npm run new <name> <title> [<template>]

# 删除页面, 删除后无法恢复, 慎用
# 删除页面时请使用此命令操作, 不要直接删除目录
npm run del <name>
```

## NPM 包 

### 基本

```sh
npm install --save-dev webpack webpack-cli webpack-merge webpack-dev-server
```

| 包名 | 说明 |
| --- | --- |
| [webpack](https://www.npmjs.com/package/webpack) | webpack is a module bundler. |
| [webpack-cli](https://www.npmjs.com/package/webpack-cli) | The official CLI of webpack. |
| [webpack-merge](https://www.npmjs.com/package/webpack-merge) | Merge configuration objects. |
| [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) | Use webpack with a development server that provides live reloading. |

### Loaders

#### 样式

```sh
npm install --save-dev sass-loader node-sass 
npm install --save-dev postcss-loader postcss-import postcss-url autoprefixer
npm install --save-dev css-loader
npm install --save-dev style-loader
```

| 包名 | 说明 |
| --- | --- |
| [sass-loader](https://www.npmjs.com/package/sass-loader) | Loads a Sass/SCSS file and compiles it to CSS. |
| [postcss-loader](https://www.npmjs.com/package/postcss-loader) | Loader for webpack to process CSS with PostCSS. |
| [css-loader](https://www.npmjs.com/package/css-loader) | Interprets @import and url() like import/require() and will resolve them. |
| [style-loader](https://www.npmjs.com/package/style-loader) | Inject CSS into the DOM. |
| [node-sass](https://www.npmjs.com/package/node-sass) | Node-sass is a library that provides binding for Node.js to LibSass. |
| [postcss-import](https://www.npmjs.com/package/postcss-import) | PostCSS plugin to transform @import rules by inlining content. |
| [postcss-url](https://www.npmjs.com/package/postcss-url) | PostCSS plugin to rebase, inline or copy on url(). |
| [autoprefixer](https://www.npmjs.com/package/autoprefixer) | PostCSS plugin to parse CSS and add vendor prefixes to CSS rules. |

**最简配置**

```js
module: {
    rules: [
        {
            test: /\.(sa|sc|c)ss$/i,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader',
            ],
        },
    ]
}
```

#### 文件

```sh
npm install --save-dev url-loader file-loader image-webpack-loader
```

| 包名 | 说明 |
| --- | --- |
| [url-loader](https://www.npmjs.com/package/url-loader) | A loader for webpack which transforms files into base64 URIs. |
| [file-loader](https://www.npmjs.com/package/file-loader) | The file-loader resolves import/require() on a file into a url <br> and emits the file into the output directory. |
| [image-webpack-loader](https://www.npmjs.com/package/image-webpack-loader) | Minify PNG, JPEG, GIF, SVG and WEBP images with imagemin. |

**最简配置**

```js
module: {
    rules: [
        {
            test: /\.(png|svg|jpe?g|gif)$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 5120, // 5k
                        name: '[name].[hash:8].[ext]', // 输出文件名
                        outputPath: 'imgs/' // 输出目录, 相对 dist
                    }
                }
            ]
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]', // 输出文件名
                        outputPath: 'fonts/' // 输出目录, 相对 dist
                    }
                }
            ]
        },
    ]
},
```

**图片压缩**

```js
module: {
    rules: [
        {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 5120, // 5k
                        name: '[name].[hash:8].[ext]', // 输出文件名
                        outputPath: 'imgs/' // 输出目录, 相对 dist
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 80
                        },
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: [0.80, 0.90],
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        webp: {
                            quality: 80
                        }
                    }
                },
            ],
        }
    ]
},

```

#### 编译 

```sh
npm install --save-dev babel-loader
npm install --save-dev @babel/core @babel/preset-env
npm install --save-dev @babel/plugin-transform-runtime
```

| 包名 | 说明 |
| --- | --- |
| [babel-loader](https://www.npmjs.com/package/babel-loader) | This package allows transpiling JavaScript files using Babel and webpack. |
| @babel/core  | |
| @babel/preset-env | |

**最简配置**

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    }
  ]
}
```

#### 清理

```sh
npm install --save-dev eslint eslint-config-airbnb-base
npm install --save-dev eslint-loader eslint-plugin-import 
npm install --save-dev eslint-friendly-formatter
npm install --save-dev babel-eslint eslint-plugin-html
```

| 包名 | 说明 |
| --- | --- |
| [eslint-loader](https://www.npmjs.com/package/eslint-loader) | A ESlint loader for webpack. |
| eslint | |
| eslint-config-airbnb-base | |
| eslint-plugin-import | | 
| eslint-friendly-formatter | |
| babel-eslint | |
| eslint-plugin-html | |

### Plugins

```sh
npm install --save-dev copy-webpack-plugin
npm install --save-dev clean-webpack-plugin
npm install --save-dev html-webpack-plugin
npm install --save-dev mini-css-extract-plugin
npm install --save-dev optimize-css-assets-webpack-plugin cssnano
```

| 包名 | 说明 |
| --- | --- |
| [copy-webpack-plugin](https://www.npmjs.com/package/copy-webpack-plugin) | Copies individual files or entire directories to the build directory. |
| [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin) | Remove/clean your build folder(s). |
| [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin) | Plugin that simplifies creation of HTML files to serve your bundles. |
| [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin) | This plugin extracts CSS into separate files. Requires webpack 4 to work. |
| [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin) | A Webpack plugin to optimize \ minimize CSS assets. |
| [cssnano](https://www.npmjs.com/package/cssnano) | cssnano takes your nicely formatted CSS. |
