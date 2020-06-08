const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const routers  = require('./routers/index')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session2')
const Store = require('./redis-store.js')
const dbConfig = require('./config.json')
const RedisConfig = {
  redis: {
    port: dbConfig.redisConfig.port,
    host: dbConfig.redisConfig.host,
    family: dbConfig.redisConfig.family,
    password: dbConfig.redisConfig.password,
    db: dbConfig.redisConfig.db
  }
}
const app = new Koa()
app.use(bodyParser())
// 使用redis
app.use(session({
  store: new Store(RedisConfig.redis),
  maxAge: 1*60*60*1000,
  key: 'sessionId'
}))
// 初始化路由
app.use(routers.routes())

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 1111
  } = nuxt.options.server

  await nuxt.ready()
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
