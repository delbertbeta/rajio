const prettybytes = require('pretty-bytes')

module.exports = async (ctx) => {
    await ctx.render('index', {
        share: false,
        maxFileSize: prettybytes(global.config.maxFileSize)
    });
}