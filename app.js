const Koa = require('koa');

const path = require('path');

const render = require('koa-views');
const serveStatic = require('koa-better-serve');
const serveSass = require('koa.sass');

const sequelize = require('./tool/sequelize');
const log4js = require('./tool/log4js');

const app = new Koa();

const config = require('./config')

global.config = config

const router = require('./router/router')

// app.use(async function (ctx, next) {
//   console.log(ctx);
//   let meta = ctx.ip + '(' + ctx.hostname + ')' + ' ' + ctx.method + ' ' + ctx.url;
//   log4js.info(meta);
//   await next();
//   return;
// });

app.use(render(__dirname + '/view', {
  map: {
    html: 'underscore'
  },
  extension: 'ejs'
}));

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