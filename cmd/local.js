const program = require('commander')

const fs = require('fs-extra')
const sequelize = require('../tool/sequelize');
const hat = require('hat');
const path = require('path')
const moment = require('moment')

const handle = async function (id, downloadLimit, timeLimit, fileSize, fileName, identifier) {
  const data = await sequelize.rajio.create({
    id,
    downloadCount: 0,
    downloadLimit,
    timeLimit,
    downloadCode: hat(24, 16),
    fileSize,
    fileName,
    identifier
  })
  return data
}

program
  .version('rajio-local 1.0.0', '-v, --version')
  .option('-l, --local-file <path>', 'Specific a local file to share')
  .option('-i, --identifier <string>', 'Specific a identifier (Optional)')
  .option('-t, --time-limit <datetime>', 'Limit the time (Optional)')
  .option('-d, --download-limit <n>', 'Limit the download count (Optional)', parseInt)
  .parse(process.argv)


if (program.localFile) {
  const filePath = path.resolve(program.localFile)
  try {
    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const fileName = path.basename(program.localFile)
    const identifier = program.identifier ? program.identifier : hat()
    const timeLimit = program.timeLimit ? moment(program.timeLimit) : null
    const downloadLimit = program.downloadLimit ? program.downloadLimit : null
    const id = hat()
    fs.ensureSymlinkSync(filePath, path.resolve(__dirname, `../data/upload/${id}`))
    handle(id, downloadLimit, timeLimit, fileSize, fileName, identifier).then(r => {
      console.log(JSON.parse(JSON.stringify(r)))
    })
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error('No such file.')
    } else {
      console.log(e)
    }
  }
} else {
  program.outputHelp()
}
