const router = require('koa-route');
const send = require('koa-send');

const route = router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        layout: 'index'
    });
    await next();
})

module.exports = route;