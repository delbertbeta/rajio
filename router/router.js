const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');
const hat = require('hat');

const index = require('./index');
const upload = require('./upload');

router.get('/', index);
router.post('/api/upload', upload.koaBody, upload.route);

module.exports = router;