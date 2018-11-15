const cron = require('node-cron')
const sequelize = require('../tool/sequelize')
const fs = require('fs-extra')
const path = require('path')

const Op = require('sequelize').Op

const garbageCollection = async () => {
  const garbages = await sequelize.findAll({
    where: {
      [Op.and]: {
        [Op.or]: {
          "downloadCount": {
            [Op.gte]: 'downloadLimit'
          },
          "timeLimit": {
            [Op.lte]: new Date()
          }
        },
        "deleted": {
          [Op.not]: true
        },
      }
    }
  })
  garbages.forEach(v => {
    v.deleted = true
    fs.removeSync(path.resolve(`./data/upload/${v.id}`))
    v.save()
  })
}

module.exports = {
  init: () => {
    cron.schedule('*/15 * * * *', garbageCollection)
  },
  recycle: (item) => {
    v.deleted = true
    v.save()
    fs.removeSync(path.resolve(`./data/upload/${item.id}`))
  }
}

