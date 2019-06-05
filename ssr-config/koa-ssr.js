/*
 * @Author: 韩公子
 * @Date: 2019-06-05 15:17:02
 * @LastEditors: 韩公子
 * @LastEditTime: 2019-06-05 17:04:27
 * @Description: vue koa2 ssr中间件
 */
const path = require('path')
const fs = require('fs')
const LRU = require('lru-cache')
const HtmlMinifier = require('html-minifier').minify

const { createBundleRenderer } = require('vue-server-renderer')

const setUpDevServer = require('./setup-dev/setup-dev-server.js')
const isProd = process.env.NODE_ENV === 'production'
const serverInfo =
  `koa/${require('koa/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`
const resolve = file => path.resolve(__dirname, file)

module.exports = app => {
  // 创建 createRenderer 工厂函数
  function createRenderer(bundle, options) {
    return createBundleRenderer(
      bundle,
      Object.assign(options, {
        // for component caching
        cache: new LRU({
          max: 1000,
          maxAge: 1000 * 60 * 15
        }),
        // this is only needed when vue-server-renderer is npm-linked
        basedir: resolve('./dist'),
        // recommended for performance
        runInNewContext: false
      })
    )
  }

  const renderToString = (ctx, renderer) => {
    const context = {
      url: ctx.url,
      title: 'Vue Koa2 SSR',
      cookies: ctx.request.headers.cookie
    }
    return new Promise((resolve, reject) => {
      renderer.renderToString(context, (err, html) => {
        if (err) {
          return reject(err)
        }
        resolve(html)
      })
    })
  }





  let renderer
  const templatePath = resolve('../index.template.html')
  // 根据不同环境运行不同的渲染
  if(isProd) {
    // 服务端配置
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    // 通用html模板
    const template = HtmlMinifier(fs.readFileSync(resolve(templatePath), 'utf-8'),{
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: false
    })
    renderer = createRenderer(serverBundle, {
      template,
      clientManifest
    })
  } else{
    // In development: setup the dev server with watch and hot-reload,
    // and create a new renderer on bundle / index template update.
    setUpDevServer(app,templatePath,(bundle, options)=>{
      try {
        renderer = createRenderer(bundle, options)
      } catch (e) {
        console.log('bundle error', e)
      }
    })
  }

  // 处理所有请求 渲染成页面
  app.use(async (ctx, next) => {
    if (!renderer) {
      ctx.type = 'html'
      ctx.body = 'waiting for compilation... refresh in a moment.'
      next()
      return
    }

    try {
      ctx.compress = true
      // 设置请求头
      ctx.set('Content-Type', 'text/html')
      ctx.set('Server', serverInfo)

      // 将 context 数据渲染为 HTML
      const html = await renderToString(ctx, renderer)
      ctx.body = html
    } catch (e) {
      // next()
    }


  })




}


