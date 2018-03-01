const multer = require('koa-multer');
const logger = require('../tool/log4js');
const sequelize = require('../tool/sequelize');
const hat = require('hat');
const koaBody = require('koa-body');

let tempInfo = {};

let koaBodyFunc = koaBody({
    multipart: true,
    formidable: {
        uploadDir: 'data/upload/',
        maxFieldsSize: 128 * 1024 * 1024,
        onFileBegin: (name, file) => {
            tempInfo.fileName = file.name;
            tempInfo.id = hat();
            file.path = tempInfo.id
            console.log(tempInfo);
        }
    }
})

const route = async function (ctx, next) {
    let obj = {
        id: tempInfo.id,
        downloadLimit: -1,
        timeLimit: -1,
        downloadCode: hat(16, 16),
        fileName: tempInfo.fileName
    }
    ctx.response.body = ctx.body.files;
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