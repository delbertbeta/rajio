const prettybytes = require('pretty-bytes')
const info = require('../tool/info')

module.exports = async (ctx) => {
    await ctx.render('status', {
        share: true,
        data: JSON.stringify({
            usage: info.getUsage(),
            downloadCount: await info.getDownloadCount(),
            totalCount: await info.getTotalCount(),
            recent: await info.getRecent()
        })
    });
}