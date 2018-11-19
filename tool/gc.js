const cron = require('node-cron')
const sequelize = require('../tool/sequelize')
const fs = require('fs-extra')
const path = require('path')
const Sequelize = require('sequelize')

const Op = require('sequelize').Op

const garbageCollection = async () => {
  const garbages = await sequelize.rajio.findAll({
    where: {
      [Op.or]: {
        "downloadCount": {
          [Op.gte]: Sequelize.col('downloadLimit')
        },
        "timeLimit": {
          [Op.lte]: new Date()
        }
      },
      "deleted": {
        [Op.not]: true
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
    item.deleted = true
    item.save()
    fs.removeSync(path.resolve(`./data/upload/${item.id}`))
  }
}

