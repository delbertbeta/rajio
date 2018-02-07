const Koa = require('koa');

const path = require('path');

const render = require('koa-ejs');
const staticServe = require('koa-better-serve');
const router = require('koa-better-router')().loadMethods();

const app = new Koa();

render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'template',
    viewExt: 'html',
    cache: true,
    debug: false
  });

router.get('/', (ctx, next) => {
    ctx.render('template', {
        body: 'Test this module.'
    });
    return next();
});

// app.use(router.middleware());
app.use(async function (ctx) {
    await ctx.render('template', {
        body: 233333
    });
})

app.use(staticServe('./static', '/static'));

app.listen(4290);
console.log('Serving at http://localhost:4290');