const send = require('koa-send');

module.exports = async (ctx, next) => {
    await ctx.render('index', {
        layout: 'index'
    });
    await next();
}