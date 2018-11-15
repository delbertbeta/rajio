const sequelize = require('../tool/sequelize')
const Op = require('sequelize').Op

const route = async function (ctx, next) {
  const items = await sequelize.findAll({
    where: {
      identifier: ctx.identifier,
      deleted: {
        [Op.not]: true
      },
      downloadCount: {
        [Op.or]: [
          null,
          {[Op.lt]: 'downloadLimit'},
        ]
      },
      timeLimit: {
        [Op.or]: [
          {[Op.gt]: new Date()},
          null
        ]
      }
    }
  })
  ctx.response.body = items
}

module.exports = {
  route
}