const Router = require('koa-router');
const router = new Router();
const download = require('./download');
const index = require('./index');
const upload = require('./upload');
const share = require('./share')

router.get('/', index)

router.post('/api/upload', upload.koaBody, upload.route);
// router.get('/s/:id')

router.param('id', (id, ctx, next) => {
  ctx.id = id
  return next()
}).get('/d/:id/:fileName', download.route)

router.param('id', (id, ctx, next) => {
  ctx.id = id
  return next()
}).get('/s/:id', share)

module.exports = router