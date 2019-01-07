const session = require('koa-session');
const Koa = require('koa');
const logger = require('koa-logger')
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

app.keys = ['dd@2)m)84m%-le$azqfki9=!&ylqj#4u4#6k7q81k=0a_p%dpn'];

const CONFIG = {
  key: 'koa:sess',
  /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true,
  /** (boolean) automatically commit headers (default true) */
  overwrite: true,
  /** (boolean) can overwrite or not (default true) */
  httpOnly: true,
  /** (boolean) httpOnly or not (default true) */
  signed: true,
  /** (boolean) signed or not (default true) */
  rolling: false,
  /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false,
  /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));
app.use(logger())
// or if you prefer all default config, just use => app.use(session(app));

app.use(async (ctx, next) => {
  if (ctx.session.user) {
    await next()
  } else if (['/login', '/login'].indexOf(ctx.path) !== -1) {
    await next()
  } else {
    ctx.redirect('/login')
  }
});

router.get('/', (ctx, next) => {
  ctx.body = 'index'
});

router.get('/admin', (ctx, next) => {
  ctx.body = 'admin'
});

router.get('/login', (ctx, next) => {
  ctx.session.user = {
    name: 'goze'
  }
  ctx.body = 'login'
});

router.get('/logout', (ctx, next) => {
  ctx.session.user = null
  ctx.body = 'logout'
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
console.log('listening on port 3000');
