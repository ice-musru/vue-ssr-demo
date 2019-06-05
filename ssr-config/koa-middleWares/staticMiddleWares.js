/**
 * 设置静态资源请求目录和设置缓存
 * @return {Promise.<void>}
 */
const path = require('path')
const KoaStatic = require('koa-static')
const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'

module.exports = function(path,cache) {
  return KoaStatic(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0,
    gzip: true
  })
}

