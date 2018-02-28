# express 源码解读

## 前言


入门node.js的api，用了几年koa，感觉自身能力总是停留在api表面。对node.js的内涵，框架底层的实现原理一窍不同。  
最近狠下决心，花了一个月的时间将express的源码仔细阅读。试着用ES6的语法将其主要代码改写，其中很多工具方法多为拷贝，待仔细

## 整体结构

* express主入口文件App.js

* express路由Router.js

* express默认中间件

* 工具类，url解析、http协议头设置等

## App.js



