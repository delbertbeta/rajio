const Koa = require('koa');
const router = require('./router/router');

const path = require('path');

const render = require('koa-ejs');
const serveStatic = require('koa-better-serve');
const serveSass = require('koa.sass');

const sequelize = require('./tool/sequelize');
const log4js = require('./tool/log4js');

const app = new Koa();


// app.use(async function (ctx, next) {
//   console.log(ctx);
//   let meta = ctx.ip + '(' + ctx.hostname + ')' + ' ' + ctx.method + ' ' + ctx.url;
//   log4js.info(meta);
//   await next();
//   return;
// });

render(app, {
  root: path.join(__dirname, 'view'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: false
});

app.use(router.routes())
  .use(router.allowedMethods());

app.use(serveSass({
  mountAt: '/static/css',
  src: './static/scss',
  dest: './static/css',
  importPaths: ['./node_modules']
}))

app.use(serveStatic('./static', '/static'));

sequelize.sync();

app.listen(4290);
log4js.info('Serving at http://localhost:4290');