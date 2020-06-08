let returnObj = {
    userReg: (data) => {
        return `insert into book_user (user_id, user_name, password) values(0, '${data.body.username}', '${data.body.password}')`
    },
    checkUser: (data) => {
        return `select password from book_user where user_name='${data.body.username}'`
    },
    getBookCategoryAndCount: (data) => {
        return `select count(*) as count, book_type from book_info group by book_type`
    }
}

module.exports = returnObj