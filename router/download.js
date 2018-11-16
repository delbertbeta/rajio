const logger = require('../tool/log4js')
const sequelize = require('../tool/sequelize')
const Sequelize = require('sequelize')
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
  const item = await sequelize.rajio.findOne({
    where: {
      id: id
    }
  })
  if (!item || item.deleted) {
    await forbiddenHandle(ctx)
    return
  }
  
  const now = moment()
  const limit = moment(item.timeLimit)
  if (item.timeLimit !== null && now.isAfter(limit, 'second')) {
    await forbiddenHandle(ctx)
    return
  }

  if (item.downloadLimit !== null && item.downloadLimit <= item.downloadCount) {
    await forbiddenHandle(ctx)
    return
  } else {
    sequelize.rajioInfo.increment('count', {
      where: {
        date: now.format('YYYY-MM-DD')
      }
    })
    item.increment('downloadCount')
  }
  
  ctx.response.attachment(item.fileName)
  const stream = await fs.createReadStream(`data/upload/${item.id}`)
  ctx.response.body = stream

}

module.exports = {
  route: route
}