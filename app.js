const Koa = require('koa');

const path = require('path');

const render = require('koa-ejs');
const serveStatic = require('koa-better-serve');
const serveSass = require('koa.sass');

const app = new Koa();

render(app, {
    root: path.join(__dirname, 'view'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: false
  });

app.use(require('./router/index'));

app.use(serveSass({
  mountAt: '/static/css',
  src: './static/scss',
  dest: './static/css',
  importPaths: ['./node_modules']
}))

app.use(serveStatic('./static', '/static'));

app.listen(4290);
console.log('Serving at http://localhost:4290');