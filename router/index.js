const prettybytes = require('pretty-bytes')

module.exports = async (ctx) => {
    await ctx.render('index', {
        share: false,
        maxFileSize: prettybytes(global.config.maxFileSize),
        data: JSON.stringify({
            maxFileSize: global.config.maxFileSize,
            prettiedMaxFileSize: prettybytes(global.config.maxFileSize),
            domain: global.config.domain
        })
    });
}