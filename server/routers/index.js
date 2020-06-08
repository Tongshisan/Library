const router = require('koa-router')()

const user = require('./user_info')
const book = require('./book_info')

router.use('/api/user', user.routes(), user.allowedMethods())
router.use('/api/book', book.routes(), book.allowedMethods())

module.exports = router