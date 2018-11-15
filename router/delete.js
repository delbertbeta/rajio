const gc = require('../tool/gc')

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
  gc.recycle(item)
  ctx.response.body = {
    message: "OK"
  }
}

module.exports = {
  route
}