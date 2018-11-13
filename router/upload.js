const multer = require('koa-multer');
const logger = require('../tool/log4js');
const sequelize = require('../tool/sequelize');
const hat = require('hat');
const koaBody = require('koa-body');
const path = require('path')

let koaBodyFunc = koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.resolve('../data/upload/'),
        maxFieldsSize: 128 * 1024 * 1024,
        onFileBegin: (name, file) => {
            file.path = './data/upload/' + hat()
        }
    }
})

const route = async function (ctx, next) {
    let data = await sequelize.create({
        id: ctx.request.files.file.path.split('/').pop(),
        downloadCount: 0,
        downloadLimit: null,
        timeLimit: null,
        downloadCode: hat(16, 16),
        fileName: ctx.request.files.file.name
    });
    ctx.response.body = data;
    // uploader.fields('file')(ctx, async (ctx, next) => {
    //     let obj = {
    //         id: tempInfo.id,
    //         downloadLimit: -1,
    //         timeLimit: -1,
    //         downloadCode: hat(16, 16),
    //         fileName: tempInfo.fileName
    //     }
    //     let data = await sequelize.create({
    //         id: obj.id,
    //         downloadCount: 0,
    //         downloadLimit: null,
    //         timeLimit: null,
    //         downloadCode: obj.downloadCode,
    //         fileName: obj.fileName
    //     });

    //     ctx.response.body = obj;
    //     tempInfo = {};
    //     // }
    //     // , () => {
    //     //     logger.error('Failed to save file ' + obj.fileName + 'on id' + obj.id + ".");
    //     //     ctx.response.body = {
    //     //         error: 'Failed to save file'
    //     //     }
    //     //     tempInfo = {};
    //     // }
    //     // )
    // })
};

module.exports = {
    koaBody: koaBodyFunc,
    route: route
}