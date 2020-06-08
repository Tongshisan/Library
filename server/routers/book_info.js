const router = require('koa-router')()
const userService = require('../service/user_info')
const bookService = require('../service/book_info')
router.post('/', async (ctx) => {
    let data = ctx.request.body
    try {
        switch (data.cmd) {
            case 'getBookCategoryAndCount' :
                await bookService.getBookCategoryAndCount(ctx)
                break
            case 'UserReg':
                await userService.userReg(ctx)
                break;
            case 'UserLogin':
                await userService.userLogin(ctx)
                break
            case 'CheckLogin':
                await userService.checkLogin(ctx)
                break
            default:
                break;
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router