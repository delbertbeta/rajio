const diskusage = require('diskusage')
const sequelize = require('../tool/sequelize')
const cron = require('node-cron')

const getUsage = () => diskusage.checkSync(__dirname)

const getDownloadCount = async () => {
  const result = await sequelize.rajio.sum('downloadCount')
  return result
}

const getTotalCount = async () => {
  const result = await sequelize.rajio.count()
  return result
}

const getRecent = async () => {
  const result = await sequelize.rajioInfo.find({
    limit: 7
  })
  return result
}

const init = () => {
  sequelize.rajioInfo.create().catch(e => {})
  cron.schedule('0 0 * * *', () => {
    sequelize.rajioInfo.create().catch(e => {})
  })
}

module.exports = {
  getUsage,
  getDownloadCount,
  getTotalCount,
  getRecent,
  init
}