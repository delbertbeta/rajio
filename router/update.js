const moment = require('moment')
const koaBody = require('koa-body')
const sequelize = require('../tool/sequelize')

const downloadLimit = [
  1, 5, 10, 20, 50, 100, 1000, null
]

const timeLimit = [
  [1, 'hour'],
  [12, 'hour'],
  [1, 'day'],
  [7, 'day'],
  [1, 'month'],
  [6, 'month'],
  [1, 'year'],
  null
]

const koaBodyRoute = koaBody()

const route = async function (ctx, next) {
  const item = await sequelize.findOne({
    where: {
      id: ctx.id
    }
  })
  if (!item || item.deleted) {
    ctx.throw(404)
    return
  }
  if (item.identifier !== ctx.identifier) {
    ctx.throw(403)
    return
  }

  const body = ctx.request.body

  const timeObj = timeLimit[body.timeLimit]
  const downloadObj = downloadLimit[body.downloadLimit]

  if ((typeof body.timeLimit !== 'number' && typeof body.downloadLimit !== 'number') || (typeof timeObj === 'undefined' && typeof downloadObj === 'undefined')) {
    ctx.throw(400, "Invalid parameter.")
    return
  }

  // update 
  if (typeof timeObj !== 'undefined') {
    if (timeObj === null) {
      item.timeLimit = null
    } else {
      const now = moment()
      const targetTime = moment(item.uploadTime).add(...timeObj)
      if (targetTime.isBefore(now, 'second')) {
        ctx.throw(400, 'time limit is before than now.')
        return
      } else {
        item.timeLimit = targetTime.toDate()
      }
    }
  }

  if (typeof downloadObj !== 'undefined') {
    if (downloadObj === null) {
      item.downloadLimit = null
    } else {
      if (downloadObj < item.downloadCount) {
        ctx.throw(400, 'download limit is less than download count.')
        return
      } else {
        item.downloadLimit = downloadObj
      }
    }
  }

  item.save()

  ctx.response.body = item
}

module.exports = {
  koaBody: koaBodyRoute,
  route
}