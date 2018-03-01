const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');
const hat = require('hat');

const index = require('./index');
const upload = require('./upload');

router.get('/', index);
router.post('/api/upload', koaBody({
    multipart: true,
    formidable: {
        uploadDir: 'data/upload/',
        maxFieldsSize: 128 * 1024 * 1024,
        onFileBegin: (name, file) => {
            let tempInfo = {};
            tempInfo.fileName = file.name;
            tempInfo.id = hat();
            file.path = tempInfo.id
            console.log(tempInfo);
        }
    }
}), upload.route);

module.exports = router;