const Router = require('koa-router');
const router = new Router();
const download = require('./download');
const index = require('./index');
const upload = require('./upload');
const share = require('./share')
const deleteHandle = require('./delete')
const update = require('./update')
const refresh = require('./refresh')

router.get('/', index)

router.post('/api/upload', upload.koaBody, upload.route);
// router.get('/s/:id')

router.param('id', (id, ctx, next) => {
  ctx.id = id
  return next()
}).get('/d/:id/:fileName', download.route)

router.param('code', (id, ctx, next) => {
  ctx.code = id
  return next()
}).get('/s/:code', share)

router.param('id', (id, ctx, next) => {
  ctx.id = id
  return next()
}).get('/s/:id', share)

router.param('id', (id, ctx, next) => {
  ctx.id = id
  return next()
}).param('identifier', (id, ctx, next) => {
  ctx.identifier = id
  return next()
}).delete('/api/:identifier/:id', deleteHandle.route)

router.param('id', (id, ctx, next) => {
  ctx.id = id
  return next()
}).param('identifier', (id, ctx, next) => {
  ctx.identifier = id
  return next()
}).put('/api/:identifier/:id', update.koaBody, update.route)

router.param('id', (id, ctx, next) => {
  ctx.id = id
  return next()
}).get('/api/:identifier', refresh.route)

module.exports = router