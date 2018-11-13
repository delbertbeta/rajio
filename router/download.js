const logger = require('../tool/log4js')
const sequelize = require('../tool/sequelize')
const fs = require('fs-extra')
const moment = require('moment')

const route = async (ctx) => {
  const id = ctx.id
  const item = await sequelize.findOne({
    where: {
      downloadCode: id
    }
  })
  if (!item) {
    ctx.throw(404, {
      message: "No such document."
    })
    return
  }
  if (item.downloadLimit !== null && item.downloadLimit <= item.downloadCount) {
    ctx.throw(404, {
      message: "No such document."
    })
    return
  } else {
    item.downloadCount++
    await item.save()
  }
  const now = moment()
  const limit = moment(item.timeLimit)
  if (item.timeLimit !== null && now.isAfter(limit, 'second')) {
    ctx.throw(404, {
      message: "No such document."
    })
  }
  ctx.response.attachment(item.fileName)
  const stream = await fs.createReadStream(`data/upload/${item.id}`)
  ctx.response.body = stream
}

module.exports = {
  route: route
}