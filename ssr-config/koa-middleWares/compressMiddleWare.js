const compress = require('koa-compress');
const compressible = require('compressible')


module.exports = function() {
  return compress({
    filter: type => !(/event\-stream/i.test(type)) && compressible(type), // 压缩数据
    threshold: 1024, // 阀值，当数据超过1kb的时候，可以压缩
    flush: require('zlib').Z_SYNC_FLUSH // zlib是node的压缩模块
  })
}
