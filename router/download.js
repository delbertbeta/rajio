const logger = require('../tool/log4js')
const sequelize = require('../tool/sequelize')
const fs = require('fs-extra')
const moment = require('moment')

const forbiddenHandle = async (ctx) => {
  ctx.response.status = 404
  await ctx.render('share', {
    share: true,
    forbidden: true
  });
}

const route = async (ctx) => {
  const id = ctx.id
  const item = await sequelize.findOne({
    where: {
      downloadCode: id
    }
  })
  if (!item) {
    await forbiddenHandle(ctx)
    return
  }
  if (item.downloadLimit !== null && item.downloadLimit <= item.downloadCount) {
    await forbiddenHandle(ctx)
    return
  } else {
    item.downloadCount++
    await item.save()
  }
  const now = moment()
  const limit = moment(item.timeLimit)
  if (item.timeLimit !== null && now.isAfter(limit, 'second')) {
    await forbiddenHandle(ctx)
    return
  }

  ctx.response.attachment(item.fileName)
  const stream = await fs.createReadStream(`data/upload/${item.id}`)
  ctx.response.body = stream

}

module.exports = {
  route: route
}