// 第 1 步：创建一个 Vue 实例
const Koa = require('koa')
const favicon = require('koa-favicon')

const koaCompressMiddle = require('./koa-middleWares/compressMiddleWare') // 数据压缩中间键
const koaStaticMiddle = require('./koa-middleWares/staticMiddleWares') // 静态资源处理
const koaErrorMiddle = require('./koa-middleWares/errorMiddleWare') // 错误处理

const SSR = require('./koa-ssr.js')

// 初始化服务器
const app = new Koa()

// 初始化静态资源
app.use(koaStaticMiddle('./dist', true))
app.use(koaStaticMiddle('./public', true))
app.use(koaStaticMiddle('./manifest.json', true))
app.use(favicon('./public/logo-48.png'))

// 初始化数据压缩
app.use(koaCompressMiddle())

app.use(koaErrorMiddle)

// 错误处理
app.on('error', err => {
  console.error('Server error: \n%s\n%s ', err.stack || '')
})

SSR(app)

const port = process.env.PORT || 3000
app.listen(port, function() {
  console.log(`server started at localhost:${port}`)
})

