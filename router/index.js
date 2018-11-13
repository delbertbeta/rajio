module.exports = async (ctx) => {
    await ctx.render('index', {
        share: false
    });
}