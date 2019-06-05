const path = require('path')
const DEBUG = process.env.NODE_ENV !== 'development'

const resolve = (file) => path.join(__dirname, file)

function createConfig (name, port) {
  return {
    name,
    script: resolve('./server.js'),
    watch: DEBUG ? [resolve('./src/*')] : false,
    merge_logs: true, // 集群的所有实例的日志文件合并
    instances: DEBUG ? 1 : 4, // 进程数 1、数字 2、'max'根据cpu内核数
    log_date_format: 'DD-MM-YYYY',
    out_file: resolve(`./logs/out.log`),
    error_file: resolve(`./logs/err.log`),
    max_memory_restart: '1G', // 当内存超过1024M时自动重启
    node_args: DEBUG ? `--debug-port=${port} --inspect=${port}` : ''
  }
}

module.exports = {
  apps: [Object.assign(createConfig('vue-ssr', 9222, {instances: DEBUG ? 1 : 2}))]
}
