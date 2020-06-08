const bookInfoDao = require('../dao/book_info')

let returnObj = {
    getBookCategoryAndCount: async (ctx) => {
        await bookInfoDao.getBookCategoryAndCount(ctx)
    },
}

module.exports = returnObj