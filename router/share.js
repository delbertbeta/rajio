const sequelize = require('../tool/sequelize')
const prettyBytes = require('pretty-bytes')

module.exports = async (ctx) => {
  const item = await sequelize.findOne({
    where: {
      downloadCode: ctx.id
    }
  })
  item.fileSize = prettyBytes(item.fileSize)
  await ctx.render('share', {
    share: true,
    item: item
  });
}