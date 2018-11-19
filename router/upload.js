const multer = require('koa-multer');
const logger = require('../tool/log4js');
const sequelize = require('../tool/sequelize');
const hat = require('hat');
const koaBody = require('koa-body');
const path = require('path')
const moment = require('moment')

let koaBodyFunc = koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.resolve('../data/upload/'),
        maxFieldsSize: global.config.maxFileSize,
        onFileBegin: (name, file) => {
            file.path = './data/upload/' + hat()
        }
    }
})

const route = async function (ctx) {
    if (typeof ctx.request.body.identifier !== 'string') {
        ctx.response.status = 401
        ctx.response.body = {
            message: 'Identifier is needed.'
        }
    } else {
        const data = await sequelize.rajio.create({
            id: ctx.request.files.file.path.split('/').pop(),
            downloadCount: 0,
            downloadLimit: null,
            timeLimit: moment().add(1, 'day').toDate(),
            downloadCode: hat(24, 16),
            fileSize: ctx.request.files.file.size,
            fileName: ctx.request.files.file.name,
            identifier: ctx.request.body.identifier
        });
        ctx.response.body = data;
    }
};

module.exports = {
    koaBody: koaBodyFunc,
    route: route
}